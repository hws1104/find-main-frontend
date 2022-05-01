import { UseQueryOptions } from 'react-query';
import { propOr } from 'ramda';

import {
  ArtworkActivity,
  ArtworkActivityVariables,
  useArtworkActivity as useArtworkActivityBaseHook,
} from 'graphql/hasura/queries/artwork-activity.generated';
import {
  BidFragment,
  ArtworkSplitRecipientsFragment,
} from 'graphql/hasura/hasura-fragments.generated';

import { getFirstValue, isAllTrue, notEmptyOrNil } from 'utils/helpers';
import { areKeysEqual, maybeGetAddressOrEmpty } from 'utils/users';

import { AuctionWithBids } from 'types/Auction';
import { LatestArtworkEvent } from 'types/Event';

export interface ArtworkActivitySelected {
  activeAuction: AuctionWithBids;
  isCurrentUserHighestBidder: boolean;
  currentUserBid: BidFragment;
  latestArtworkEvents: LatestArtworkEvent[];
  splitRecipients: ArtworkSplitRecipientsFragment['splitRecipients'];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useArtworkActivity(
  variables: ArtworkActivityVariables,
  options?: UseQueryOptions<ArtworkActivity, Error, ArtworkActivitySelected>
) {
  const { contractSlug, tokenId } = variables;

  const { enabled = true } = options;

  const currentUserPublicKey = maybeGetAddressOrEmpty(
    variables.currentUserPublicKey
  );

  return useArtworkActivityBaseHook(
    { contractSlug, tokenId, currentUserPublicKey },
    {
      ...options,
      enabled: isAllTrue([contractSlug, tokenId, enabled]),
      select: (res) => {
        const artwork = getFirstValue(res.artworks);
        const activeAuction = getFirstValue(res.auctions);
        const auctionBids = propOr<[], AuctionWithBids, BidFragment[]>(
          [],
          'bids',
          activeAuction
        );
        return {
          splitRecipients: artwork.splitRecipients,
          latestArtworkEvents: artwork.latestEvents,
          activeAuction,
          isCurrentUserHighestBidder: notEmptyOrNil(res.highestBidAuctions),
          currentUserBid: auctionBids.find((bid) =>
            areKeysEqual([bid.bidder, currentUserPublicKey])
          ),
        };
      },
    }
  );
}
