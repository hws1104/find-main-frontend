import { useCallback } from 'react';

import useSegment from './use-segment';

// bid events
type BidEvent = 'bid_viewed' | 'bid_placed' | 'bid_approved' | 'bid_rejected';
// wallet events
type WalletEvent = 'wallet_connected';
// search events
type GlobalSearch = 'global_search';
// follow events
type FollowEvent = 'follow_create' | 'follow_remove';
// settle events
type SettleEvent = 'auction_settled';
// featured artwork
type FeaturedArtworkEvent = 'primary_featured_artwork_clicked';
// mint events
type MintEvent = 'artwork_minted';
// list events
type ListEvent = 'artwork_listed';

type EventName =
  | BidEvent
  | WalletEvent
  | GlobalSearch
  | FollowEvent
  | SettleEvent
  | FeaturedArtworkEvent
  | MintEvent
  | ListEvent;

type SegmentEvent<T> = {
  eventName: EventName;
  payload: T;
};

export type SegmentAuctionEvent = {
  contractAddress: string;
  auctionId: number;
  tokenId: number;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useSegmentEvent<T extends Record<string, any>>() {
  const analytics = useSegment();

  const sendSegmentEvent = useCallback(
    (event: SegmentEvent<T>) => {
      analytics?.track(event.eventName, event.payload);
    },
    [analytics]
  );

  return [sendSegmentEvent];
}
