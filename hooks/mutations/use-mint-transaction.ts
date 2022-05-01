import { cond, T } from 'ramda';
import { ContractTransaction } from '@ethersproject/contracts';
import { useMutation, UseMutationOptions } from 'react-query';

import useCollectionMintAndApprove from 'hooks/web3/transactions/use-collection-mint-and-approve';
import useUploadMetadataToPinata from 'hooks/web3/use-upload-metadata-to-pinata';
import useMintWithSplits from 'hooks/web3/transactions/use-mint-with-splits';
import useMintAndApproveMarket from 'hooks/web3/transactions/use-mint-and-approve-market';
import useCollectionMintWithSplits from 'hooks/web3/transactions/use-collection-mint-with-splits';

import { useSetDraftArtworkToMinting } from 'graphql/server/mutations/set-draft-artwork-to-minting.generated';
import { useUpdateDraftArtwork } from 'graphql/server/mutations/update-artwork.generated';

import { MintFormValues } from 'components/transactions/mint/types';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { PinataApiKeyResult } from 'hooks/queries/use-generate-pinata-key';

import { isAllTrue } from 'utils/helpers';
import { isFNDContractAddress } from 'utils/collections';

interface MintTransactionVariables {
  artwork: ArtworkFragmentExtended;
  pinataApiKey: PinataApiKeyResult;
}

// this monolithic hook is responsible for the lifecycle of minting an NFT
//
// 1. uploading the metadata to ipfs
// 2. updating the web2 draft with info
// 3. calling the web3 transaction itself (of which there’s 4 paths)
// 4. update the draft artwork to be in minting state

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useMintTransaction(
  variables: MintTransactionVariables,
  options?: UseMutationOptions<
    ContractTransaction,
    Error,
    MintFormValues,
    unknown
  >
) {
  const { artwork, pinataApiKey } = variables;

  // ipfs mutation
  const { mutateAsync: uploadMetadataToPinata } = useUploadMetadataToPinata();

  // FND contract web3 mutations
  const { mutateAsync: mintAndApproveMarket } = useMintAndApproveMarket();
  const { mutateAsync: mintWithSplits } = useMintWithSplits();

  // custom collection web3 mutations
  const { mutateAsync: collectionMintAndApprove } =
    useCollectionMintAndApprove();
  const { mutateAsync: collectionMintWithSplits } =
    useCollectionMintWithSplits();

  // artwork web2 mutations
  const { mutateAsync: updateDraftArtwork } = useUpdateDraftArtwork();
  const { mutateAsync: setDraftArtworkToMinting } =
    useSetDraftArtworkToMinting();

  return useMutation(async (values) => {
    const { splits, splitsEnabled } = values;

    const hasSplits = isAllTrue([splits.length > 1, splitsEnabled]);

    const isFndContract = isFNDContractAddress(values.contractAddress);

    const metadata = await uploadMetadataToPinata({
      assetPath: artwork.assetPath,
      name: values.name,
      description: values.description,
      jwt: pinataApiKey?.JWT,
    });

    await updateDraftArtwork({
      data: {
        id: artwork.id,
        name: values.name,
        description: values.description,
        contractAddress: values.contractAddress,
        metadataIPFSPath: metadata.metadataIPFSPath,
      },
    });

    const transaction = await cond<boolean, Promise<ContractTransaction>>([
      // mint with splits on the FND contract
      [
        () => isAllTrue([isFndContract, hasSplits]),
        async () => {
          console.log('mint with splits on the FND contract');
          return await mintWithSplits({
            ipfsPath: metadata.metadataIPFSPath,
            splits,
          });
        },
      ],
      // regular mint transaction on the FND contract
      [
        () => isFndContract,
        async () => {
          console.log('regular mint transaction on the FND contract');
          return await mintAndApproveMarket({
            ipfsPath: metadata.metadataIPFSPath,
          });
        },
      ],
      // mint with splits on a collection contract
      [
        () => hasSplits,
        async () => {
          console.log('mint with splits on a collection contract');
          return await collectionMintWithSplits({
            contractAddress: values.contractAddress,
            ipfsPath: metadata.metadataIPFSPath,
            splits,
          });
        },
      ],
      // regular mint transaction on a collection contract
      [
        T,
        async () => {
          console.log('regular mint transaction on a collection contract');
          return await collectionMintAndApprove({
            contractAddress: values.contractAddress,
            ipfsPath: metadata.metadataIPFSPath,
          });
        },
      ],
    ])();

    await setDraftArtworkToMinting({
      id: artwork.id,
      mintTxHash: transaction.hash,
    });

    return transaction;
  }, options);
}

useMintTransaction.getKey = () => 'MintTransaction';
