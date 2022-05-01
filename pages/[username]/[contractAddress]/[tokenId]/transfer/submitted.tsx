import { useEffect } from 'react';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import TransferTransactionSuccess from 'components/transactions/transfer/TransferTransactionSuccess';
import TransferTransactionTransferring from 'components/transactions/transfer/TransferTransactionTransferring';
import LoadingPage from 'components/LoadingPage';

import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useContractEventHandler from 'hooks/web3/transactions/use-contract-event-handler';
import useTransactionParams from 'hooks/use-transaction-params';
import useEventByTransactionHash from 'hooks/queries/hasura/events/use-event-by-transaction-hash';

import { buildArtworkPath } from 'utils/artwork/artwork';

import { getNFT721ContractToRead } from 'lib/contracts';

import Artwork from 'types/Artwork';

const getPageTitle = (artwork: Artwork) =>
  artwork ? `Transfer ${artwork.name}` : 'Transfer';

TransferSubmitted.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Transfer',
  buildTitle: getPageTitle,
});

export default function TransferSubmitted(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { txHash } = useTransactionParams();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const [isEventEmitted, setIsEventEmitted] = useContractEventHandler();

  const { provider } = useReadOnlyProvider();
  const { data: user } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const artwork = artworkData;
  const status = artwork?.status;

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });

  const nftContract = getNFT721ContractToRead({
    provider,
    contractAddress: artworkData?.contractAddress,
  });

  useEventByTransactionHash(
    { transactionHash: txHash },
    { onSuccess: (res) => setIsEventEmitted(Boolean(res)) }
  );

  useEffect(() => {
    if (nftContract && publicAddress) {
      nftContract.once(
        nftContract.filters.Transfer(publicAddress, null, null),
        () => {
          // setIsEventEmitted(true)
        }
      );
    }
  }, [nftContract, publicAddress, setIsEventEmitted]);

  if (!isEventEmitted) {
    return <TransferTransactionTransferring txHash={txHash} />;
  }

  if (isArtworkLoading) {
    return <LoadingPage />;
  }

  return (
    <TransferTransactionSuccess
      txHash={txHash}
      status={status}
      artworkPath={artworkPath}
    />
  );
}
