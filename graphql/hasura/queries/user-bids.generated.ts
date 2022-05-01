import * as Types from '../types-hasura.generated';

import { ActivityBidFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserBidsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type UserBids = { bidsPlacedOpen: Array<ActivityBidFragment>, bidsPlacedEnded: Array<ActivityBidFragment>, bidsReceived: Array<ActivityBidFragment> };


export const UserBidsDocument = /*#__PURE__*/ `
    query UserBids($publicKey: String!) {
  bidsPlacedOpen: bid(
    order_by: {datePlaced: desc}
    where: {bidder: {_eq: $publicKey}, auction: {status: {_eq: "OPEN"}}}
  ) {
    ...ActivityBidFragment
  }
  bidsPlacedEnded: bid(
    order_by: {datePlaced: desc}
    where: {status: {_eq: "HIGHEST"}, auction: {status: {_eq: "ENDED"}, highestBidder: {_eq: $publicKey}}}
  ) {
    ...ActivityBidFragment
  }
  bidsReceived: bid(
    order_by: {datePlaced: desc}
    where: {seller: {_eq: $publicKey}, auction: {status: {_in: ["OPEN", "ENDED"]}}, status: {_in: ["HIGHEST", "FINALIZED_WINNER"]}}
  ) {
    ...ActivityBidFragment
  }
}
    ${ActivityBidFragment}`;
export const useUserBids = <
      TData = UserBids,
      TError = Error
    >(
      variables: UserBidsVariables, 
      options?: UseQueryOptions<UserBids, TError, TData>
    ) => 
    useQuery<UserBids, TError, TData>(
      ['UserBids', variables],
      hasuraFetcher<UserBids, UserBidsVariables>(UserBidsDocument, variables),
      options
    );
useUserBids.getKey = (variables: UserBidsVariables) => ['UserBids', variables];
