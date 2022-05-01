import ArtworkPageMetaButton from './ArtworkPageMetaButton';

import { ComputedArtworkStatus } from 'types/artwork/artwork';
import { ArtworkV2 } from 'types/Artwork';
import { AuctionWithBids } from 'types/Auction';

import {
  buildArtworkListPath,
  buildArtworkPath,
  buildCreatorArtworkPath,
  hasActivePrivateSale,
} from 'utils/artwork/artwork';
import { isAuctionEnded } from 'utils/auctions/auctions';
import { parseDateToUnix } from 'utils/dates/dates';
import { areKeysEqual } from 'utils/users';

export interface ArtworkPageMetaProps {
  status: ComputedArtworkStatus;
  artwork: ArtworkV2;
  isOwnerOnProfile: boolean;
  isOwner: boolean;
  auction: AuctionWithBids;
  publicAddress: string;
}

export default function ArtworkPageMeta(
  props: ArtworkPageMetaProps
): JSX.Element {
  const { status, artwork, isOwnerOnProfile, isOwner, auction, publicAddress } =
    props;
  const settlePath = buildArtworkPath({ artwork, user: artwork.creator });
  const primaryPath = buildCreatorArtworkPath(artwork);
  const secondaryPath = buildArtworkPath({ artwork, user: artwork.creator });
  const hasPrivateSale = hasActivePrivateSale(artwork);
  const hasAuctionEnded = isAuctionEnded(parseDateToUnix(auction?.endsAt));
  const isHighestBidderAndAuctionHasEnded = areKeysEqual([
    publicAddress,
    auction?.highestBidder,
  ]);

  if (status === ComputedArtworkStatus.Burned) {
    return null;
  }
  if (isOwnerOnProfile) {
    if (status === ComputedArtworkStatus.Minted) {
      return (
        <ArtworkPageMetaButton
          disabled={hasPrivateSale}
          href={buildArtworkListPath(artwork, 'primary')}
        >
          List
        </ArtworkPageMetaButton>
      );
    }
  }
  if (isOwner) {
    if (
      [
        ComputedArtworkStatus.Settled,
        ComputedArtworkStatus.PrivateSale,
        ComputedArtworkStatus.Transferred,
      ].includes(status)
    ) {
      return (
        <ArtworkPageMetaButton
          href={buildArtworkListPath(artwork, 'secondary')}
          disabled={hasPrivateSale}
        >
          List
        </ArtworkPageMetaButton>
      );
    }
    if (status === ComputedArtworkStatus.Unsettled) {
      return (
        <ArtworkPageMetaButton href={`${settlePath}/settle`}>
          Settle
        </ArtworkPageMetaButton>
      );
    }
  }
  // if auction has ended, is unsettled, and you were the highest bidder
  if (
    hasAuctionEnded &&
    isHighestBidderAndAuctionHasEnded &&
    status === ComputedArtworkStatus.Unsettled
  ) {
    return (
      <ArtworkPageMetaButton href={`${settlePath}/settle`}>
        Settle
      </ArtworkPageMetaButton>
    );
  }
  return null;
}
