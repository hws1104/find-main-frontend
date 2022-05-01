import * as Types from '../types-hasura.generated';

import { CollectionFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionsBySlugsVariables = Types.Exact<{
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
  slugs: Array<Types.Scalars['citext']> | Types.Scalars['citext'];
}>;


export type CollectionsBySlugs = { collections: Array<CollectionFragmentExtended> };


export const CollectionsBySlugsDocument = /*#__PURE__*/ `
    query CollectionsBySlugs($limit: Int!, $offset: Int!, $slugs: [citext!]!) {
  collections: collection(
    limit: $limit
    offset: $offset
    where: {slug: {_in: $slugs}}
  ) {
    ...CollectionFragmentExtended
  }
}
    ${CollectionFragmentExtended}`;
export const useCollectionsBySlugs = <
      TData = CollectionsBySlugs,
      TError = Error
    >(
      variables: CollectionsBySlugsVariables, 
      options?: UseQueryOptions<CollectionsBySlugs, TError, TData>
    ) => 
    useQuery<CollectionsBySlugs, TError, TData>(
      ['CollectionsBySlugs', variables],
      hasuraFetcher<CollectionsBySlugs, CollectionsBySlugsVariables>(CollectionsBySlugsDocument, variables),
      options
    );
useCollectionsBySlugs.getKey = (variables: CollectionsBySlugsVariables) => ['CollectionsBySlugs', variables];
