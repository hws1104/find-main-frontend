import * as Types from '../types-hasura.generated';

import { UserFragment, ArtworkFragment, CollectionFragment, LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment, MostRecentAuctionFragment, ArtworkEventFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserCollectorsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentUserPublicKey: Types.Scalars['String'];
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
}>;


export type UserCollectors = { collectors: Array<(
    { isFollowingUser: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }
    & UserFragment
  )> };


export const UserCollectorsDocument = /*#__PURE__*/ `
    query UserCollectors($publicKey: String!, $currentUserPublicKey: String!, $limit: Int!, $offset: Int!) {
  collectors: user(
    limit: $limit
    offset: $offset
    where: {ownedArtworks: {isIndexed: {_eq: true}, deletedAt: {_is_null: true}, publicKey: {_eq: $publicKey}, ownerPublicKey: {_neq: $publicKey}, user: {_or: [{follows: {userByFollowingUser: {publicKey: {_eq: $currentUserPublicKey}}}}, {publicKey: {_is_null: false}}]}}}
  ) {
    ...UserFragment
    isFollowingUser: follows_aggregate(
      where: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}
    ) {
      aggregate {
        count
      }
    }
  }
}
    ${UserFragment}`;
export const useUserCollectors = <
      TData = UserCollectors,
      TError = Error
    >(
      variables: UserCollectorsVariables, 
      options?: UseQueryOptions<UserCollectors, TError, TData>
    ) => 
    useQuery<UserCollectors, TError, TData>(
      ['UserCollectors', variables],
      hasuraFetcher<UserCollectors, UserCollectorsVariables>(UserCollectorsDocument, variables),
      options
    );
useUserCollectors.getKey = (variables: UserCollectorsVariables) => ['UserCollectors', variables];
