import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionOwnersVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
  currentUserPublicKey: Types.Scalars['String'];
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
}>;


export type CollectionOwners = { owners: Array<(
    Pick<Types.User, 'name' | 'username' | 'profileImageUrl' | 'userIndex' | 'publicKey'>
    & { isFollowingUser: { aggregate?: Types.Maybe<Pick<Types.Follow_Aggregate_Fields, 'count'>> } }
  )> };


export const CollectionOwnersDocument = /*#__PURE__*/ `
    query CollectionOwners($contractSlug: citext!, $currentUserPublicKey: String!, $limit: Int!, $offset: Int!) {
  owners: user(
    limit: $limit
    offset: $offset
    where: {ownedArtworks: {collection: {slug: {_eq: $contractSlug}}}}
  ) {
    name
    username
    profileImageUrl
    userIndex
    publicKey
    isFollowingUser: follows_aggregate(
      where: {user: {_eq: $currentUserPublicKey}, isFollowing: {_eq: true}}
    ) {
      aggregate {
        count
      }
    }
  }
}
    `;
export const useCollectionOwners = <
      TData = CollectionOwners,
      TError = Error
    >(
      variables: CollectionOwnersVariables, 
      options?: UseQueryOptions<CollectionOwners, TError, TData>
    ) => 
    useQuery<CollectionOwners, TError, TData>(
      ['CollectionOwners', variables],
      hasuraFetcher<CollectionOwners, CollectionOwnersVariables>(CollectionOwnersDocument, variables),
      options
    );
useCollectionOwners.getKey = (variables: CollectionOwnersVariables) => ['CollectionOwners', variables];
