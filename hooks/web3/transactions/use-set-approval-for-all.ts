import { UseMutationOptions } from 'react-query';
import { ContractTransaction, Overrides } from 'ethers';

import { getNFTMarketAddress } from 'lib/addresses';
import { getNFT721Contract, getNFT721ContractToRead } from 'lib/contracts';

import { calculateGasMargin } from 'utils/gas';

import useWeb3Mutation from 'hooks/web3/use-web3-mutation';

export interface ApproveParams {
  contractAddress: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useSetApprovalForAll<
  TError = Error,
  TContext = unknown
>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    ApproveParams,
    TContext
  >
) {
  return useWeb3Mutation(async (variables) => {
    const { contractAddress, provider, readOnlyProvider } = variables;

    const signer = provider.getSigner();

    const nft721Contract = getNFT721Contract({ signer, contractAddress });
    const signerAddress = await signer.getAddress();

    const nft721ContractForEstimation = getNFT721ContractToRead({
      provider: readOnlyProvider,
      contractAddress,
    });
    const nftMarketAddr = getNFTMarketAddress();

    const estimatedGas =
      await nft721ContractForEstimation.estimateGas.setApprovalForAll(
        nftMarketAddr,
        true,
        { from: signerAddress }
      );

    const gasLimit = calculateGasMargin(estimatedGas);

    const txOptions: Overrides = {
      gasLimit: gasLimit.toString(),
    };

    return await nft721Contract.setApprovalForAll(
      nftMarketAddr,
      true,
      txOptions
    );
  }, options);
}
