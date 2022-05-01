import { path } from 'ramda';

import useBalance from 'hooks/queries/use-balance';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useHasSocialVerification from 'hooks/queries/hasura/use-has-social-verification';
import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';

import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import BidContainer from 'components/transactions/bid/BidContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import ArtworkWarningBlock from 'components/trust-safety/ArtworkWarningBlock';

import { isAnyTrue } from 'utils/helpers';
import { isArtworkOrCreatorModerated } from 'utils/moderation';

import { AuctionFragment } from 'graphql/hasura/hasura-fragments.generated';
import Artwork from 'types/Artwork';

const getPageTitle = (artwork: Artwork) =>
  artwork ? `Bid on ${artwork.name}` : 'Bid on';

BidIndex.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Bid on',
  buildTitle: getPageTitle,
});

export default function BidIndex(): JSX.Element {
  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const { data: balance, isLoading: balanceLoading } = useBalance();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const mostRecentAuction = path<AuctionFragment>(['auctions', 0], artworkData);

  const auctionId = mostRecentAuction?.auctionId;

  const creatorPublicKey = artworkData?.creator?.publicKey;

  const {
    data: hasSocialVerification,
    isLoading: isSocialVerificationsLoading,
  } = useHasSocialVerification({
    publicKey: creatorPublicKey,
  });

  const { isModerated } = isArtworkOrCreatorModerated(artworkData);

  const isLoading = isAnyTrue([
    balanceLoading,
    isArtworkLoading,
    isUserLoading,
    isSocialVerificationsLoading,
  ]);

  if (isLoading) {
    return <SpinnerStroked size={44} />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isModerated) {
    return <ArtworkWarningBlock artwork={artworkData} />;
  }

  return (
    <BidContainer
      artwork={artworkData}
      balance={balance}
      hasSocialVerification={hasSocialVerification}
      mostRecentAuction={mostRecentAuction}
      auctionId={auctionId}
      user={user}
    />
  );
}
