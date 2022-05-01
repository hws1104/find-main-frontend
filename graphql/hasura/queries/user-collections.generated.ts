import * as Types from '../types-hasura.generated';

import { CollectionFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserCollectionsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
}>;


export type UserCollections = { collections: Array<CollectionFragmentExtended> };


export const UserCollectionsDocument = /*#__PURE__*/ `
    query UserCollections($publicKey: String!, $limit: Int!, $offset: Int!) {
  collections: collection(
    where: {user: {publicKey: {_eq: $publicKey}}, isIndexed: {_eq: true}, hiddenAt: {_is_null: true}}
    order_by: {createdAt: desc}
    limit: $limit
    offset: $offset
  ) {
    ...CollectionFragmentExtended
  }
}
    ${CollectionFragmentExtended}`;
export const useUserCollections = <
      TData = UserCollections,
      TError = Error
    >(
      variables: UserCollectionsVariables, 
      options?: UseQueryOptions<UserCollections, TError, TData>
    ) => 
    useQuery<UserCollections, TError, TData>(
      ['UserCollections', variables],
      hasuraFetcher<UserCollections, UserCollectionsVariables>(UserCollectionsDocument, variables),
      options
    );
useUserCollections.getKey = (variables: UserCollectionsVariables) => ['UserCollections', variables];
