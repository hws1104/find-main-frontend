import { useRouter } from 'next/router';
import { useCallback } from 'react';

import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { isValidTxHash } from 'utils/helpers';
import { toBNFixed } from 'utils/numbers';
import { isNonUserRejectedError } from 'utils/transactions';
import { getMostRecentAuction } from 'utils/auctions/auctions';

import { ChangePriceFormValues } from './types';
import { MethodEnum } from 'types/NFTMarketInterface';
import { ModalKey } from 'types/modal';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { TransactionError } from '../TransactionError';
import ChangePriceView from './ChangePriceView';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface ChangePriceContainerProps {
  artwork: ArtworkFragmentExtended;
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
}

export default function ChangePriceContainer(
  props: ChangePriceContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork, artwork } = props;

  const router = useRouter();

  const { setCurrentModal } = useModal();

  const mostRecentActiveAuction = getMostRecentAuction(artwork);
  const auctionId = mostRecentActiveAuction?.auctionId;

  // TODO: Use user route rather than creator route
  const submittedRoute = useNextRoute('/change-price/submitted');

  const {
    sendChangePriceTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.ChangePrice });

  const handleEthereumTx = useCallback(
    async (values: ChangePriceFormValues) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const price = Number(values?.price);

      if (!auctionId) {
        return;
      }
      const changePricePayload = {
        auctionId: auctionId,
        reservePrice: toBNFixed(price),
      };

      const txHash = await sendChangePriceTransaction(changePricePayload);

      const hasValidTxHash = isValidTxHash(txHash);

      if (hasValidTxHash) {
        // TODO: @gosseti Decide if we want to push to a new route
        // when it has submitted or if we want to use
        // the isSuccess to show the component below
        await router.push({
          pathname: submittedRoute,
          query: { txHash },
        });
      }
    },
    [
      auctionId,
      router,
      submittedRoute,
      isProviderLoading,
      sendChangePriceTransaction,
      setCurrentModal,
    ]
  );

  // Keep showing loading state up until we redirect
  if (isLoading || isSuccess) {
    return <TransactionAwaitingConfirmation />;
  }

  if (isWrongNetwork) {
    return <MetaMaskError />;
  }

  if (isError && isNonUserRejectedError(error)) {
    return (
      <TransactionError error={error} resetTransaction={resetTransaction} />
    );
  }

  return <ChangePriceView onSubmit={handleEthereumTx} artwork={artwork} />;
}
