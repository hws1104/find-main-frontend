import { useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import {
  ArtworkFragmentExtended,
  BidFragment,
} from 'graphql/hasura/hasura-fragments.generated';

import { AuctionWithBids } from 'types/Auction';
import { ArtworkEvent } from 'types/Event';
import Account from 'types/Account';

import ArtworkAuctionPrice from './ArtworkAuctionPrice';
import AuctionStateOwnedBy from './auction-state/AuctionStateOwnedBy';
import AuctionStateGeneric from './auction-state/AuctionStateGeneric';
import Text from 'components/base/Text';
import { renderArtworkAuctionCountdown } from 'components/artworks/auction/ArtworkAuctionCountdown';

import { getMinutesRemaining, parseDateToUnix } from 'utils/dates/dates';
import { isAuctionEnded, isAuctionNotYetListed } from 'utils/auctions/auctions';
import {
  isPrivateSaleOwnerMostRecent,
  isTransferredOwnerMostRecent,
} from 'utils/artwork/artwork';
import { buildBidPath } from 'utils/bids/bids';

import {
  SOLD_FOR_LABEL,
  CURRENT_BID_LABEL,
  RESERVE_PRICE_LABEL,
} from 'lib/constants';

interface ArtworkAuctionStateProps {
  auction: AuctionWithBids;
  artworkHistory: ArtworkEvent[];
  creator: Account;
  artwork: ArtworkFragmentExtended;
  publicAddress: string;
  currentUserBid: BidFragment;
}

export default function ArtworkAuctionState(
  props: ArtworkAuctionStateProps
): JSX.Element {
  const {
    auction,
    artworkHistory,
    creator,
    artwork,
    currentUserBid,
    publicAddress,
  } = props;

  const bidPath = buildBidPath({ creator, artwork });
  const hasAuctionEnded = isAuctionEnded(parseDateToUnix(auction?.endsAt));
  const isNotYetListed = isAuctionNotYetListed(auction);
  const hasDifferentOwnerMostRecent =
    isTransferredOwnerMostRecent(artworkHistory);
  const hasPrivateSaleMostRecent = isPrivateSaleOwnerMostRecent(artworkHistory);
  const isDraftArwork = artwork.status === 'DRAFT';

  const [minutesRemaining, setMinutesRemaining] = useState(
    getMinutesRemaining(parseDateToUnix(auction?.endsAt))
  );

  useHarmonicIntervalFn(() => {
    const minutesRemaining = getMinutesRemaining(
      parseDateToUnix(auction?.endsAt)
    );
    setMinutesRemaining(minutesRemaining);
  }, 1000);

  if (isDraftArwork || !artwork.ownerPublicKey) {
    return null;
  }

  if (hasDifferentOwnerMostRecent) {
    return <AuctionStateOwnedBy ownedBy={artwork.ownerPublicKey} />;
  }

  if (hasPrivateSaleMostRecent) {
    const mostRecentSoldPrivateSale = artwork?.privateSales.filter(
      (ps) => ps.soldAt
    )[0];
    return (
      <AuctionStateOwnedBy ownedBy={mostRecentSoldPrivateSale?.buyer}>
        <ArtworkAuctionPrice
          artwork={artwork}
          label={SOLD_FOR_LABEL}
          amountInETH={Number(mostRecentSoldPrivateSale?.price)}
        />
      </AuctionStateOwnedBy>
    );
  }

  if (isNotYetListed) {
    return null;
  }

  // if the artwork has been sold
  if (hasAuctionEnded) {
    return (
      <AuctionStateOwnedBy ownedBy={auction.highestBidder}>
        <ArtworkAuctionPrice
          artwork={artwork}
          label={SOLD_FOR_LABEL}
          amountInETH={auction.highestBidAmount}
        />
      </AuctionStateOwnedBy>
    );
  }

  // TODO: In the case where the piece has been transferred, the info about the latest auction isn't relevant if the auction hasn’t met its reserve and is waiting to go active
  if (!auction?.highestBidder) {
    return (
      <AuctionStateGeneric
        artwork={artwork}
        currentUserBid={currentUserBid}
        label={RESERVE_PRICE_LABEL}
        amountInETH={auction.reservePriceInETH}
        auction={auction}
        minutesRemaining={minutesRemaining}
        bidPath={bidPath}
        publicAddress={publicAddress}
      />
    );
  }

  const isLessThanFifteenMins = minutesRemaining < 15;

  return (
    <AuctionStateGeneric
      artwork={artwork}
      label={CURRENT_BID_LABEL}
      amountInETH={auction.highestBidAmount}
      auction={auction}
      currentUserBid={currentUserBid}
      minutesRemaining={minutesRemaining}
      bidPath={bidPath}
      publicAddress={publicAddress}
    >
      {renderArtworkAuctionCountdown({
        endDate: parseDateToUnix(auction.endsAt),
        minutesRemaining,
      })}
      {isLessThanFifteenMins && (
        <Text
          css={{
            fontSize: 12,
            color: '$black60',
            '@bp4': {
              gridColumn: '1/3',
            },
          }}
        >
          Any bids placed in the last 15 minutes will reset the countdown back
          to 15 minutes.
        </Text>
      )}
    </AuctionStateGeneric>
  );
}
