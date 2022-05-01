import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type TrendingAuctionsVariables = Types.Exact<{
  limit: Types.Scalars['Int'];
}>;


export type TrendingAuctions = { auctions: Array<(
    Pick<Types.Auction, 'id' | 'auctionId' | 'highestBidder' | 'endsAt'>
    & { bidCount: { aggregate?: Types.Maybe<Pick<Types.Bid_Aggregate_Fields, 'count'>> }, bidVolumeInETH: { aggregate?: Types.Maybe<{ sum?: Types.Maybe<Pick<Types.Bid_Sum_Fields, 'bidAmount'>> }> }, artwork?: Types.Maybe<ArtworkFragmentExtended> }
  )> };


export const TrendingAuctionsDocument = /*#__PURE__*/ `
    query TrendingAuctions($limit: Int!) {
  auctions: auction(
    where: {status: {_in: ["OPEN"]}, artwork: {isIndexed: {_eq: true}, hiddenAt: {_is_null: true}}, highestBidder: {_is_null: false}}
    order_by: {highestBidAmount: desc}
    limit: $limit
  ) {
    id
    auctionId
    highestBidder
    endsAt
    bidCount: bids_aggregate {
      aggregate {
        count
      }
    }
    bidVolumeInETH: bids_aggregate {
      aggregate {
        sum {
          bidAmount
        }
      }
    }
    artwork {
      ...ArtworkFragmentExtended
    }
  }
}
    ${ArtworkFragmentExtended}`;
export const useTrendingAuctions = <
      TData = TrendingAuctions,
      TError = Error
    >(
      variables: TrendingAuctionsVariables, 
      options?: UseQueryOptions<TrendingAuctions, TError, TData>
    ) => 
    useQuery<TrendingAuctions, TError, TData>(
      ['TrendingAuctions', variables],
      hasuraFetcher<TrendingAuctions, TrendingAuctionsVariables>(TrendingAuctionsDocument, variables),
      options
    );
useTrendingAuctions.getKey = (variables: TrendingAuctionsVariables) => ['TrendingAuctions', variables];
