import { useRouter } from 'next/router';
import { useCallback } from 'react';

import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';

import { isValidTxHash } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';
import { getMostRecentAuction } from 'utils/auctions/auctions';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { ModalKey } from 'types/modal';
import {
  MethodEnum,
  SendMarketTransactionUnlistParams,
} from 'types/NFTMarketInterface';

import UnlistView from './UnlistView';
import { TransactionError } from '../TransactionError';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface UnlistContainerProps {
  balance: number;
  authToken: string;
  isWrongNetwork: boolean;
  artwork: ArtworkFragmentExtended;
  resetTransaction: () => void;
}

// TODO: Confirm that this flow still works well after
// removing the formik element
export default function UnlistContainer(
  props: UnlistContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork, artwork } = props;

  const router = useRouter();

  const { setCurrentModal } = useModal();

  const mostRecentActiveAuction = getMostRecentAuction(artwork);
  const auctionId = mostRecentActiveAuction?.auctionId;

  // TODO: Use user route rather than creator route
  const submittedRoute = useNextRoute('/unlist/submitted');

  const {
    sendUnlistTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Unlist });

  const handleEthereumTx = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    if (!auctionId) {
      return;
    }

    const unlistPayload: SendMarketTransactionUnlistParams = {
      auctionId,
    };

    const txHash = await sendUnlistTransaction(unlistPayload);

    const hasValidTxHash = isValidTxHash(txHash);

    if (hasValidTxHash) {
      await router.push({
        pathname: submittedRoute,
        query: { txHash },
      });
    }
  }, [
    auctionId,
    sendUnlistTransaction,
    router,
    submittedRoute,
    setCurrentModal,
    isProviderLoading,
  ]);

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

  return <UnlistView onSubmit={handleEthereumTx} />;
}
