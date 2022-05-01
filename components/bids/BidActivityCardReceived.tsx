/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import React from 'react';
import { useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import { isAuctionEnded } from 'utils/auctions/auctions';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { parseDateToUnix } from 'utils/dates/dates';

import Box from 'components/base/Box';
import UserTagInline from 'components/users/UserTagInline';
import ArtworkAuctionPriceV2 from 'components/artworks/auction/ArtworkAuctionPriceV2';
import ActivityCardVertical, {
  ActivityCardVerticalHeader,
} from 'components/activity/ActivityCardVertical';
import ActivityMetaSecondary from 'components/activity/ActivityMetaSecondary';
import ActivityCardHorizontal, {
  ActivityCardHorizontalProps,
  ActivityCardHorizontalHeader,
} from 'components/activity/ActivityCardHorizontal';
import ArtworkAuctionCountdownTimerV2 from 'components/artworks/auction/ArtworkAuctionCountdownV2';
import { ActivityMetaTitle } from 'components/activity/ActivityMetaPrimary';

import { ActivityCardProps } from 'components/activity/types';
import { UserBids } from 'graphql/hasura/queries/user-bids.generated';

type BidActivity = UserBids['bidsReceived'][0];
interface BidActivityCardReceivedProps {
  bid: BidActivity;
  artwork: BidActivity['artwork'];
  auction: BidActivity['auction'];
}

export default function BidActivityCardReceived(
  props: BidActivityCardReceivedProps
): JSX.Element {
  const { bid, auction, artwork } = props;

  // TODO: Add skeleton defensive guard for when artwork doesn’t exist
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
      <Box>
        <ActivityMetaTitle css={{ marginBottom: '$4' }}>
          Winning bidder
        </ActivityMetaTitle>
        <UserTagInline user={auction.highestBidderUser} />
      </Box>
    ) : (
      <BidAuctionCountdown dateEnding={dateEnding} />
    ),
    actionSection: hasAuctionEnded ? (
      <ActivityMetaSecondary
        title="Your NFT sold!"
        description="Congratulations! Your NFT has sold in auction. Settle the auction to claim your ETH."
        button={{
          href: `${artworkPath}/settle`,
          label: 'Settle auction',
          color: 'black',
        }}
      />
    ) : (
      <ActivityMetaSecondary
        title="Your auction is live!"
        description="Congratulations, your NFT received a bid! The 24-hour auction countdown has started."
        button={{
          href: artworkPath,
          label: 'View NFT',
          color: 'black',
        }}
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

interface BidAuctionCountdownProps {
  dateEnding: number;
  className?: string;
}

const getHasFinished = (dateEnding: number) => {
  return Math.floor(Date.now() / 1000) > dateEnding;
};

function BidAuctionCountdown(props: BidAuctionCountdownProps): JSX.Element {
  const { dateEnding, className } = props;

  const [hasFinished, setHasFinished] = useState<boolean>(() =>
    getHasFinished(dateEnding)
  );

  const setFinished = () => {
    const hasFinished = getHasFinished(dateEnding);

    setHasFinished(hasFinished);
  };

  useHarmonicIntervalFn(setFinished, hasFinished ? null : 1000);

  return (
    <Box className={className}>
      {!hasFinished && <ActivityMetaTitle>Auction ends in</ActivityMetaTitle>}
      <ArtworkAuctionCountdownTimerV2 timestamp={dateEnding} />
    </Box>
  );
}
