import {
  MultipleQueriesQuery,
  SearchOptions,
  SearchResponse,
} from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch/lite';

import algoliaClient from 'lib/clients/algolia';
import { AlgoliaSearchIndex } from 'types/Algolia';

const searchIndexes: Map<AlgoliaSearchIndex, SearchIndex> = new Map([
  ['users', algoliaClient.initIndex('users')],
  ['collections', algoliaClient.initIndex('collections')],
  [
    'collections_sort_date_created_asc',
    algoliaClient.initIndex('collections_sort_date_created_asc'),
  ],
  [
    'collections_sort_date_created_desc',
    algoliaClient.initIndex('collections_sort_date_created_desc'),
  ],
  [
    'collections_sort_date_last_minted_to_asc',
    algoliaClient.initIndex('collections_sort_date_last_minted_to_asc'),
  ],
  [
    'collections_sort_date_last_minted_to_desc',
    algoliaClient.initIndex('collections_sort_date_last_minted_to_desc'),
  ],
]);

export const defaultSearchIndexes: Record<'collections', AlgoliaSearchIndex> = {
  collections: 'collections_sort_date_last_minted_to_desc',
};

interface AlgoliaSearchResultsArgs {
  index: AlgoliaSearchIndex;
  query: string;
  options: SearchOptions;
}

export async function getAlgoliaSearchResults<T>({
  index,
  query,
  options,
}: AlgoliaSearchResultsArgs): Promise<SearchResponse<T>> {
  const searchIndex = searchIndexes.get(index);
  return await searchIndex.search(query, options);
}

export async function getAlgoliaMultipleSearchResults<T>(
  query: MultipleQueriesQuery[]
): Promise<T> {
  // algolia’s types can only handle results from a
  // single index so we need to manually override it
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await algoliaClient.search(query);
}
