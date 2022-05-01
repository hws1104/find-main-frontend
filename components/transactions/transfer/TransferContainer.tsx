import { useRouter } from 'next/router';
import { useCallback } from 'react';

import useNextRoute from 'hooks/use-next-route';
import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
import useModal from 'hooks/use-modal';
import useTransactionParams from 'hooks/use-transaction-params';

import { isValidTxHash } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';

import {
  MethodEnum,
  SendNFTTransactionTransferParams,
} from 'types/NFTMarketInterface';
import { TransferFormValues } from './types';
import { ModalKey } from 'types/modal';

import { TransactionError } from '../TransactionError';
import TransferView from './TransferView';
import MetaMaskError from 'components/auth/MetaMaskError';
import TransactionAwaitingConfirmation from '../TransactionAwaitingConfirmation';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface TransferContainerProps {
  balance: number;
  authToken: string;
  resetTransaction: () => void;
  isWrongNetwork: boolean;
  publicAddress: string;
  artwork: ArtworkFragmentExtended;
}

export default function TransferContainer(
  props: TransferContainerProps
): JSX.Element {
  const { resetTransaction, isWrongNetwork, publicAddress, artwork } = props;

  const router = useRouter();

  const { tokenId } = useTransactionParams();

  const contractAddress = artwork?.contractAddress;

  const { setCurrentModal } = useModal();

  const submittedRoute = useNextRoute('/transfer/submitted');

  const {
    sendTransferTransaction,
    isSuccess,
    isLoading,
    isProviderLoading,
    isError,
    error,
  } = useNFTTransaction({ method: MethodEnum.Transfer });

  const handleEthereumTx = useCallback(
    async (values: TransferFormValues) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const transferPayload: SendNFTTransactionTransferParams = {
        to: values.to,
        from: publicAddress,
        tokenId,
        contractAddress,
      };

      const txHash = await sendTransferTransaction(transferPayload);

      const hasValidTxHash = isValidTxHash(txHash);

      if (hasValidTxHash) {
        await router.push({
          pathname: submittedRoute,
          query: { txHash },
        });
      }
    },
    [
      router,
      publicAddress,
      submittedRoute,
      tokenId,
      isProviderLoading,
      contractAddress,
      sendTransferTransaction,
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

  return <TransferView onSubmit={handleEthereumTx} />;
}
