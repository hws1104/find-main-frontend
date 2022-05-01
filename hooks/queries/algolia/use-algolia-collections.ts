import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { useCallback } from 'react';

import { AlgoliaCollection, AlgoliaSearchIndex } from 'types/Algolia';
import { getAlgoliaSearchResults } from './shared';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

interface AlgoliaCollectionsVariables {
  searchTerm: string;
  searchIndex: AlgoliaSearchIndex;
  options?: SearchOptions;
}

export type AlgoliaCollectionSearch = SearchResponse<AlgoliaCollection>;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useAlgoliaCollections(
  variables: AlgoliaCollectionsVariables,
  options?: UseInfiniteQueryOptions<
    AlgoliaCollectionSearch,
    Error,
    AlgoliaCollectionSearch
  >
) {
  return useInfiniteQuery(
    useAlgoliaCollections.getKey(variables),
    ({ pageParam = 0 }) =>
      getAlgoliaSearchResults<AlgoliaCollection>({
        index: variables.searchIndex,
        query: variables.searchTerm,
        options: {
          ...variables.options,
          page: pageParam,
          hitsPerPage: PUBLIC_FEED_PER_PAGE_COUNT,
        },
      }),
    {
      ...options,
      getNextPageParam: (lastPage) => {
        const lastPageNumber = lastPage.page;
        const totalPageCount = lastPage.nbPages;
        const nextPageIndex = lastPageNumber + 1;

        return lastPageNumber < totalPageCount ? nextPageIndex : undefined;
      },
    }
  );
}

useAlgoliaCollections.getKey = (variables: AlgoliaCollectionsVariables) => [
  'AlgoliaCollections',
  variables,
];

interface AlgoliaCollectionsVariables {
  searchTerm: string;
  searchIndex: AlgoliaSearchIndex;
}

export function useAlgoliaCollectionsVariables(
  options?: UseQueryOptions<AlgoliaCollectionsVariables, Error>
) {
  return useQuery(useAlgoliaCollectionsVariables.getKey(), options);
}

useAlgoliaCollectionsVariables.getKey = () => ['AlgoliaCollectionsVariables'];

export function useUpdateAlgoliaCollectionsVariables() {
  const queryClient = useQueryClient();
  return useCallback(
    (variables: Partial<AlgoliaCollectionsVariables>) => {
      queryClient.setQueryData<AlgoliaCollectionsVariables>(
        useAlgoliaCollectionsVariables.getKey(),
        (previousState) => ({ ...previousState, ...variables })
      );
    },
    [queryClient]
  );
}
