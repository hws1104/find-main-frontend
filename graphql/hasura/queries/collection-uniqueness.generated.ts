import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionUniquenessVariables = Types.Exact<{
  slug: Types.Scalars['citext'];
}>;


export type CollectionUniqueness = { collections: Array<Pick<Types.Collection, 'id' | 'slug'>> };


export const CollectionUniquenessDocument = /*#__PURE__*/ `
    query CollectionUniqueness($slug: citext!) {
  collections: collection(where: {slug: {_eq: $slug}}) {
    id
    slug
  }
}
    `;
export const useCollectionUniqueness = <
      TData = CollectionUniqueness,
      TError = Error
    >(
      variables: CollectionUniquenessVariables, 
      options?: UseQueryOptions<CollectionUniqueness, TError, TData>
    ) => 
    useQuery<CollectionUniqueness, TError, TData>(
      ['CollectionUniqueness', variables],
      hasuraFetcher<CollectionUniqueness, CollectionUniquenessVariables>(CollectionUniquenessDocument, variables),
      options
    );
useCollectionUniqueness.getKey = (variables: CollectionUniquenessVariables) => ['CollectionUniqueness', variables];
