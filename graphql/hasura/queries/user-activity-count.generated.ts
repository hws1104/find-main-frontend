import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserActivityCountVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
}>;


export type UserActivityCount = { privateSalesCount: { aggregate?: Types.Maybe<Pick<Types.Private_Sale_Aggregate_Fields, 'count'>> }, placedBidsOpenCount: { aggregate?: Types.Maybe<Pick<Types.Bid_Aggregate_Fields, 'count'>> }, placedBidsEndedCount: { aggregate?: Types.Maybe<Pick<Types.Bid_Aggregate_Fields, 'count'>> }, receivedBidsCount: { aggregate?: Types.Maybe<Pick<Types.Auction_Aggregate_Fields, 'count'>> } };


export const UserActivityCountDocument = /*#__PURE__*/ `
    query UserActivityCount($publicKey: String!, $currentDate: timestamp!) {
  privateSalesCount: private_sale_aggregate(
    where: {deadlineAt: {_gt: $currentDate}, soldAt: {_is_null: true}, _or: [{buyer: {_eq: $publicKey}}, {seller: {_eq: $publicKey}}]}
  ) {
    aggregate {
      count
    }
  }
  placedBidsOpenCount: bid_aggregate(
    where: {bidder: {_eq: $publicKey}, auction: {status: {_eq: "OPEN"}}}
    distinct_on: auctionId
  ) {
    aggregate {
      count
    }
  }
  placedBidsEndedCount: bid_aggregate(
    where: {status: {_eq: "HIGHEST"}, auction: {status: {_eq: "ENDED"}, highestBidder: {_eq: $publicKey}}}
    distinct_on: auctionId
  ) {
    aggregate {
      count
    }
  }
  receivedBidsCount: auction_aggregate(
    where: {status: {_in: ["ENDED", "OPEN"]}, bids: {seller: {_eq: $publicKey}}}
    distinct_on: auctionId
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useUserActivityCount = <
      TData = UserActivityCount,
      TError = Error
    >(
      variables: UserActivityCountVariables, 
      options?: UseQueryOptions<UserActivityCount, TError, TData>
    ) => 
    useQuery<UserActivityCount, TError, TData>(
      ['UserActivityCount', variables],
      hasuraFetcher<UserActivityCount, UserActivityCountVariables>(UserActivityCountDocument, variables),
      options
    );
useUserActivityCount.getKey = (variables: UserActivityCountVariables) => ['UserActivityCount', variables];
