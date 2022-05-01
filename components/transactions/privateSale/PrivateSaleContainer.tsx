/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { parseEther } from '@ethersproject/units';

import Box from 'components/base/Box';
import PrivateSaleFormView from './PrivateSaleFormView';
import { TransactionFormContainer } from '../TransactionContainerV2';
import TransactionSplitPane from '../TransactionSplitPane';
import TransactionPane from 'components/transactions/TransactionPane';
import PrivateSaleForm from './PrivateSaleForm';
import PrivateSaleConfirmView from './PrivateSaleConfirmView';
import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import PrivateSaleApproveContainer from './PrivateSaleApproveContainer';

import { getFirstValue } from 'utils/helpers';
import { add24hoursTimestamp, parseDateToUnix } from 'utils/dates/dates';
import { getMostRecentAuction, isAuctionEnded } from 'utils/auctions/auctions';

import { useCreatePrivateSaleSignature } from 'hooks/web3/transactions/use-nft-signature';
import { useCreatePrivateSale } from 'graphql/server/mutations/create-private-sale.generated';

import useTransactionParams from 'hooks/use-transaction-params';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useModal from 'hooks/use-modal';
import useNavigationFlowState from 'state/stores/navigation-flow';
import { ArtworkSplitsByContractSlugTokenId } from 'graphql/hasura/queries/artwork-splits-by-contract-slug-token-id.generated';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { PrivateSaleFormValues } from './types';
import { ModalKey } from 'types/modal';

import { PINATA_JSON_ENDPOINT } from 'lib/constants';
import { PrivateFlowStep } from '../navigationFlows';
import { generatePinataApiKey } from 'queries/uploads';

interface PrivateSaleContainerProps {
  splits: ArtworkSplitsByContractSlugTokenId['artworkSplits'];
  artwork: ArtworkFragmentExtended;
  isApproved: boolean;
}

export default function PrivateSaleContainer(
  props: PrivateSaleContainerProps
): JSX.Element {
  const { splits, artwork, isApproved } = props;

  const router = useRouter();
  const username = getFirstValue(router.query.username);
  const { tokenId } = useTransactionParams();
  const { data: user } = useWalletSession();
  const [isConfirmScreen, setIsConfirmScreen] = useState(false);
  const { mutateAsync: createSignatureAsync } = useCreatePrivateSaleSignature();

  const { mutateAsync } = useCreatePrivateSale();
  const { setCurrentModal } = useModal();

  const contractAddress = artwork?.contractAddress;
  const contractSlug = artwork?.collection?.slug;
  const token = user?.token;

  const mostRecentActiveAuction = getMostRecentAuction(artwork);

  const { setPercentCompleted, setActiveStep } = useNavigationFlowState(
    (state) => state
  );

  const isSecondarySale = isAuctionEnded(
    parseDateToUnix(mostRecentActiveAuction?.endsAt)
  );

  const handleSubmit = async (values: PrivateSaleFormValues) => {
    try {
      const deadline = add24hoursTimestamp();
      const signature = await createSignatureAsync({
        buyerAddress: values.buyerAddress,
        tokenId,
        contractAddress,
        price: Number(values.price),
        deadline,
      });

      const pinataToken = await generatePinataApiKey(token);

      const ipfsRes = await fetch(PINATA_JSON_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pinataToken.JWT}`,
        },
        body: JSON.stringify({
          tokenId,
          seller: user?.publicAddress,
          buyer: values.buyerAddress,
          price: parseEther(values.price.toString()).toString(),
          deadline,
          signature,
          nftContract: contractAddress,
        }),
      });

      const ipfsBody = await ipfsRes.json();
      const ipfsHash = ipfsBody?.IpfsHash;

      await mutateAsync({
        data: {
          tokenId: Number(tokenId),
          contractAddress,
          buyerPublicKey: values.buyerAddress,
          saleAmountInETH: values.price.toString(),
          deadlineAt: new Date(deadline * 1000).toUTCString(),
          signature,
          ipfsPath: ipfsHash,
          personalMessage: values.personalMessage,
        },
      });
      setPercentCompleted(100);
      setActiveStep(PrivateFlowStep.Send);

      await router.push(
        `/${username}/${contractSlug}/${tokenId}/private-sale/submitted?ipfsHash=${ipfsHash}`
      );
    } catch (error) {
      if (error.message === 'No Provider Error') {
        setCurrentModal(ModalKey.AUTH_MAIN);
      }
      console.log(error);
    }
  };

  const handleContinueClick = () => {
    setPercentCompleted(50);
    setActiveStep(PrivateFlowStep.Confirm);
    setIsConfirmScreen(true);
  };

  return (
    <TransactionFormContainer>
      <TransactionSplitPane
        css={{ display: 'block', '@bp1': { display: 'grid' } }}
      >
        <Box css={{ display: 'none', '@bp1': { display: 'block' } }}>
          <ArtworkCardMinimal artwork={artwork} creator={artwork?.creator} />
        </Box>
        <PrivateSaleForm
          onSubmit={handleSubmit}
          initialValues={{
            buyerAddress: '',
            price: '',
            personalMessage: '',
            enablePersonalMessage: false,
          }}
        >
          {!isApproved ? (
            <Box
              css={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                paddingLeft: '$8',
              }}
            >
              <PrivateSaleApproveContainer
                onSubmit={() => setCurrentModal(ModalKey.MARKET_APPROVAL)}
              />
            </Box>
          ) : (
            <TransactionPane
              css={{
                display: 'block',
                position: 'relative',
                marginTop: '$9',
                '@bp1': { marginTop: 0 },
              }}
            >
              {isConfirmScreen ? (
                <>
                  <PrivateSaleConfirmView onEditClick={setIsConfirmScreen} />
                </>
              ) : (
                <PrivateSaleFormView
                  onContinueClick={handleContinueClick}
                  isSecondarySale={isSecondarySale}
                  splits={splits}
                />
              )}
            </TransactionPane>
          )}
        </PrivateSaleForm>
      </TransactionSplitPane>
    </TransactionFormContainer>
  );
}
