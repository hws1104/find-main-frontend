import * as Types from '../types-hasura.generated';

import { CollectionFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionsVariables = Types.Exact<{
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
  excludeSlugs: Array<Types.Scalars['citext']> | Types.Scalars['citext'];
}>;


export type Collections = { collections: Array<CollectionFragmentExtended> };


export const CollectionsDocument = /*#__PURE__*/ `
    query Collections($limit: Int!, $offset: Int!, $excludeSlugs: [citext!]!) {
  collections: collection(
    limit: $limit
    offset: $offset
    order_by: {createdAt: desc}
    where: {slug: {_nin: $excludeSlugs}, hiddenAt: {_is_null: true}}
  ) {
    ...CollectionFragmentExtended
  }
}
    ${CollectionFragmentExtended}`;
export const useCollections = <
      TData = Collections,
      TError = Error
    >(
      variables: CollectionsVariables, 
      options?: UseQueryOptions<Collections, TError, TData>
    ) => 
    useQuery<Collections, TError, TData>(
      ['Collections', variables],
      hasuraFetcher<Collections, CollectionsVariables>(CollectionsDocument, variables),
      options
    );
useCollections.getKey = (variables: CollectionsVariables) => ['Collections', variables];
