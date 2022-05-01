import { useQuery, UseQueryOptions } from 'react-query';
import { SearchResponse, MultipleQueriesQuery } from '@algolia/client-search';

import { AlgoliaUser, AlgoliaArtwork, AlgoliaCollection } from 'types/Algolia';
import { getAlgoliaMultipleSearchResults } from './shared';

import { FND_CONTRACT_SLUG } from 'lib/constants';

export type AlgoliaSearch = {
  results: [
    SearchResponse<AlgoliaCollection>,
    SearchResponse<AlgoliaUser>,
    SearchResponse<AlgoliaArtwork>
  ];
};

interface AlgoliaSearchVariables {
  searchTerm: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useAlgoliaSearch(
  variables: AlgoliaSearchVariables,
  options?: UseQueryOptions<AlgoliaSearch, Error>
) {
  return useQuery(
    useAlgoliaSearch.getKey(variables),
    () =>
      getAlgoliaMultipleSearchResults(
        buildAlgoliaSearchQuery(variables.searchTerm)
      ),
    options
  );
}

useAlgoliaSearch.getKey = (variables: AlgoliaSearchVariables) => [
  'AlgoliaSearch',
  variables,
];

export function buildAlgoliaSearchQuery(
  searchTerm: string
): MultipleQueriesQuery[] {
  return [
    {
      indexName: 'collections',
      query: searchTerm,
      params: {
        hitsPerPage: 3,
        facetFilters: [`slug:-${FND_CONTRACT_SLUG}`, 'isHidden:false'],
      },
    },
    {
      indexName: 'users',
      query: searchTerm,
      params: {
        hitsPerPage: 3,
        facetFilters: ['moderationStatus:ACTIVE', 'isHidden:false'],
      },
    },
    {
      indexName: 'artworks',
      query: searchTerm,
      params: {
        hitsPerPage: 3,
        facetFilters: [
          'moderationStatus:ACTIVE',
          'isDeleted:false',
          'isHidden:false',
        ],
      },
    },
  ];
}
