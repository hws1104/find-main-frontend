import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionArtworkCountsVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
}>;


export type CollectionArtworkCounts = { artworksTotalCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, availableCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> }, soldCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } };


export const CollectionArtworkCountsDocument = /*#__PURE__*/ `
    query CollectionArtworkCounts($contractSlug: citext!) {
  artworksTotalCount: artwork_aggregate(
    where: {isIndexed: {_eq: true}, status: {_eq: "MINTED"}, collection: {slug: {_eq: $contractSlug}}}
  ) {
    aggregate {
      count
    }
  }
  availableCount: artwork_aggregate(
    where: {isIndexed: {_eq: true}, status: {_eq: "MINTED"}, collection: {slug: {_eq: $contractSlug}}, activeSalePriceInETH: {_is_null: false}}
  ) {
    aggregate {
      count
    }
  }
  soldCount: artwork_aggregate(
    where: {isIndexed: {_eq: true}, status: {_eq: "MINTED"}, collection: {slug: {_eq: $contractSlug}}, activeSalePriceInETH: {_is_null: true}, lastSalePriceInETH: {_is_null: false}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const useCollectionArtworkCounts = <
      TData = CollectionArtworkCounts,
      TError = Error
    >(
      variables: CollectionArtworkCountsVariables, 
      options?: UseQueryOptions<CollectionArtworkCounts, TError, TData>
    ) => 
    useQuery<CollectionArtworkCounts, TError, TData>(
      ['CollectionArtworkCounts', variables],
      hasuraFetcher<CollectionArtworkCounts, CollectionArtworkCountsVariables>(CollectionArtworkCountsDocument, variables),
      options
    );
useCollectionArtworkCounts.getKey = (variables: CollectionArtworkCountsVariables) => ['CollectionArtworkCounts', variables];
