import { ArtworkActivity } from 'graphql/hasura/queries/artwork-activity.generated';

export type HighestBidAuction = {
  endsAt: string;
};

export type AuctionWithBids = ArtworkActivity['auctions'][0];

export enum AuctionStatus {
  OPEN = 'OPEN',
  CANCELED = 'CANCELED',
  FINALIZED = 'FINALIZED',
  ENDED = 'ENDED',
}

export type MarketType = 'primary' | 'secondary';
