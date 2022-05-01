import { getMostRecentAuction } from 'utils/auctions/auctions';
import { isAnyTrue } from 'utils/helpers';

import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import SettleContainer from 'components/transactions/settle/SettleContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';

SettleIndex.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Settle auction',
});

export default function SettleIndex(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const isLoading = isAnyTrue([isArtworkLoading, isUserLoading]);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return (
    <SettleContainer
      artwork={artworkData}
      auction={getMostRecentAuction(artworkData)}
      publicAddress={publicAddress}
    />
  );
}
