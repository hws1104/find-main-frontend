import { ActivityCardProps } from 'components/activity/types';
import { parseDateToUnix } from 'utils/dates/dates';

import { isAuctionEnded } from 'utils/auctions/auctions';
import { buildArtworkPath } from 'utils/artwork/artwork';

import Box from 'components/base/Box';
import ArtworkAuctionPriceV2 from 'components/artworks/auction/ArtworkAuctionPriceV2';
import ActivityCardVertical, {
  ActivityCardVerticalHeader,
} from 'components/activity/ActivityCardVertical';
import ActivityMetaSecondary from 'components/activity/ActivityMetaSecondary';
import ArtworkAuctionCountdownTimerV2 from 'components/artworks/auction/ArtworkAuctionCountdownV2';
import ActivityCardHorizontal, {
  ActivityCardHorizontalProps,
  ActivityCardHorizontalHeader,
} from 'components/activity/ActivityCardHorizontal';
import { ActivityMetaTitle } from 'components/activity/ActivityMetaPrimary';

import { BidAuctionEndedInfo, BidAuctionStatus } from './BidStatus';
import { UserBids } from 'graphql/hasura/queries/user-bids.generated';
import { areKeysEqual } from 'utils/users';

type BidActivity = UserBids['bidsReceived'][0];
interface BidActivityCardProps {
  bid: BidActivity;
  artwork: BidActivity['artwork'];
  auction: BidActivity['auction'];
}

export default function BidActivityCard(
  props: BidActivityCardProps
): JSX.Element {
  const { bid, artwork, auction } = props;

  if (!artwork) {
    return null;
  }

  const dateEnding = parseDateToUnix(auction.endsAt);

  const hasAuctionEnded = isAuctionEnded(dateEnding);

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });

  const activityCardProps: ActivityCardProps = {
    headerSection: <ActivityCardVerticalHeader artwork={artwork} />,
    priceSection: (
      <ArtworkAuctionPriceV2
        label={hasAuctionEnded ? 'Winning bid' : 'Current bid'}
        amountInETH={auction.highestBidAmount}
      />
    ),
    countdownSection: hasAuctionEnded ? (
      <BidAuctionEndedInfo dateEnding={dateEnding} />
    ) : (
      <Box>
        <ActivityMetaTitle>Auction ends in</ActivityMetaTitle>
        <ArtworkAuctionCountdownTimerV2 timestamp={dateEnding} />
      </Box>
    ),
    actionSection: hasAuctionEnded ? (
      <ActivityMetaSecondary
        title="You won!"
        description="Congratulations! You won the auction. Settle the auction to add it to your collection."
        button={{
          href: `${artworkPath}/settle`,
          label: 'Settle auction',
          color: 'black',
        }}
      />
    ) : (
      <BidAuctionStatus
        isHighestBid={areKeysEqual([auction.highestBidder, bid.bidder])}
        bid={bid}
        artworkPath={artworkPath}
      />
    ),
  };

  const activityCardHorizontalProps: ActivityCardHorizontalProps = {
    ...activityCardProps,
    headerSection: <ActivityCardHorizontalHeader artwork={artwork} />,
    artwork,
    title: artwork.name,
    creator: artwork.creator,
  };

  return (
    <>
      <ActivityCardVertical {...activityCardProps} />
      <ActivityCardHorizontal {...activityCardHorizontalProps} />
    </>
  );
}
