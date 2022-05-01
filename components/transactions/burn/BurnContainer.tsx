import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useNextRouteCreator } from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';
import useTransactionParams from 'hooks/use-transaction-params';

import { isValidTxHash } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';

import { TransactionError } from '../TransactionError';
import {
  MethodEnum,
  SendNFTTransactionBurnParams,
} from 'types/NFTMarketInterface';
import { ModalKey } from 'types/modal';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import BurnView from './BurnView';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';

interface BurnContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
  artwork: ArtworkFragmentExtended;
}

export default function BurnContainer(props: BurnContainerProps): JSX.Element {
  const { resetTransaction, isWrongNetwork, artwork } = props;

  const router = useRouter();

  const { tokenId } = useTransactionParams();

  const contractAddress = artwork?.contractAddress;

  const { setCurrentModal } = useModal();

  const submittedRoute = useNextRouteCreator('/burn/submitted');

  const {
    sendBurnTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Burn });

  const handleEthereumTx = useCallback(async () => {
    if (isProviderLoading) {
      return setCurrentModal(ModalKey.AUTH_MAIN);
    }

    const burnPayload: SendNFTTransactionBurnParams = {
      tokenId,
      contractAddress,
    };

    const txHash = await sendBurnTransaction(burnPayload);

    const hasValidTxHash = isValidTxHash(txHash);

    if (hasValidTxHash) {
      await router.push({
        pathname: submittedRoute,
        query: { txHash },
      });
    }
  }, [
    router,
    submittedRoute,
    contractAddress,
    tokenId,
    isProviderLoading,
    sendBurnTransaction,
    setCurrentModal,
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

  return <BurnView onSubmit={handleEthereumTx} />;
}
