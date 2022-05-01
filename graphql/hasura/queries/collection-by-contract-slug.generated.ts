import * as Types from '../types-hasura.generated';

import { CollectionFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionByContractSlugVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
}>;


export type CollectionByContractSlug = { collections: Array<CollectionFragmentExtended> };


export const CollectionByContractSlugDocument = /*#__PURE__*/ `
    query CollectionByContractSlug($contractSlug: citext!) {
  collections: collection(
    where: {slug: {_eq: $contractSlug}, isIndexed: {_eq: true}}
  ) {
    ...CollectionFragmentExtended
  }
}
    ${CollectionFragmentExtended}`;
export const useCollectionByContractSlug = <
      TData = CollectionByContractSlug,
      TError = Error
    >(
      variables: CollectionByContractSlugVariables, 
      options?: UseQueryOptions<CollectionByContractSlug, TError, TData>
    ) => 
    useQuery<CollectionByContractSlug, TError, TData>(
      ['CollectionByContractSlug', variables],
      hasuraFetcher<CollectionByContractSlug, CollectionByContractSlugVariables>(CollectionByContractSlugDocument, variables),
      options
    );
useCollectionByContractSlug.getKey = (variables: CollectionByContractSlugVariables) => ['CollectionByContractSlug', variables];
