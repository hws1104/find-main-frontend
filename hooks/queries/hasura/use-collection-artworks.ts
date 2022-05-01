import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { ClientError } from 'graphql-request';

import { ArtworkStatus } from 'types/Artwork';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';

import { getNextPageParam } from 'utils/artwork/artwork';
import {
  ArtworksByContractWithFilters,
  ArtworksByContractWithFiltersVariables,
  ArtworksByContractWithFiltersDocument,
} from 'graphql/hasura/queries/artworks-by-contract-with-filters.generated';
import {
  Artwork_Bool_Exp,
  Artwork_Order_By,
} from 'graphql/hasura/types-hasura.generated';
import {
  CollectionFilter,
  CollectionSort,
} from 'components/collections/CollectionFilters';
import { cond, equals } from 'ramda';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface GetWhereClauseArgs {
  contractSlug: string;
  filter: CollectionFilter;
}

interface GetOrderClauseArgs {
  sort: CollectionSort;
}

interface UseCollectionArtworksVariables {
  contractSlug: string;
  filterKey: CollectionFilter;
  sortKey: CollectionSort;
}

const getWhereClause = (args: GetWhereClauseArgs): Artwork_Bool_Exp => {
  const { contractSlug, filter } = args;

  const clause = cond<CollectionFilter, Artwork_Bool_Exp>([
    [equals(CollectionFilter.All), () => ({})],
    [
      equals(CollectionFilter.Available),
      () => ({ activeSalePriceInETH: { _is_null: false } }),
    ],
    [
      equals(CollectionFilter.Sold),
      () => ({
        activeSalePriceInETH: { _is_null: true },
        lastSalePriceInETH: { _is_null: false },
      }),
    ],
  ])(filter);

  return {
    collection: { slug: { _eq: contractSlug } },
    isIndexed: { _eq: true },
    status: { _eq: ArtworkStatus.MINTED },
    ...clause,
  };
};

const getOrderClause = (args: GetOrderClauseArgs): Artwork_Order_By => {
  const { sort } = args;
  const clause = cond<CollectionSort, Artwork_Order_By>([
    [
      equals(CollectionSort.PriceAsc),
      () => ({
        activeSalePriceInETH: 'asc_nulls_last',
        lastSalePriceInETH: 'asc_nulls_last',
      }),
    ],
    [
      equals(CollectionSort.PriceDesc),
      () => ({
        activeSalePriceInETH: 'desc_nulls_last',
        lastSalePriceInETH: 'desc_nulls_last',
      }),
    ],
    [
      equals(CollectionSort.DateMintedAsc),
      () => ({
        tokenId: 'asc',
      }),
    ],
    [
      equals(CollectionSort.DateMintedDesc),
      () => ({
        tokenId: 'desc',
      }),
    ],
  ])(sort);
  return clause;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getCollectionArtworks(
  variables: ArtworksByContractWithFiltersVariables
) {
  const client = fndHasuraClient();
  const data = await client.request<
    ArtworksByContractWithFilters,
    ArtworksByContractWithFiltersVariables
  >(ArtworksByContractWithFiltersDocument, variables);
  return data.artworks;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCollectionArtworks(
  variables: UseCollectionArtworksVariables,
  options?: UseInfiniteQueryOptions<
    ArtworkFragmentExtended[],
    ClientError,
    ArtworkFragmentExtended[]
  >
) {
  const { contractSlug, filterKey, sortKey } = variables;

  return useInfiniteQuery(
    ['ArtworksByContractAddress', variables],
    ({ pageParam = 0 }) =>
      getCollectionArtworks({
        whereClause: getWhereClause({
          contractSlug: contractSlug,
          filter: filterKey,
        }),
        orderClause: getOrderClause({ sort: sortKey }),
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    {
      ...options,
      enabled: Boolean(contractSlug),
      getNextPageParam,
      keepPreviousData: true,
    }
  );
}
