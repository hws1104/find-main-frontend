import { useQuery, UseQueryOptions } from 'react-query';
import { SearchOptions, SearchResponse } from '@algolia/client-search';

import { AlgoliaUser } from 'types/Algolia';
import { getAlgoliaSearchResults } from './shared';

interface AlgoliaUserSearchVariables {
  searchTerm: string;
  options?: SearchOptions;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useAlgoliaUserSearch(
  variables: AlgoliaUserSearchVariables,
  options?: UseQueryOptions<SearchResponse<AlgoliaUser>, Error>
) {
  return useQuery(
    useAlgoliaUserSearch.getKey(variables),
    () =>
      getAlgoliaSearchResults<AlgoliaUser>({
        index: 'users',
        query: variables.searchTerm,
        options: { ...searchOptions, ...variables.options },
      }),
    options
  );
}

useAlgoliaUserSearch.getKey = (variables: AlgoliaUserSearchVariables) => [
  'AlgoliaUserSearch',
  variables,
];

const searchOptions: SearchOptions = {
  hitsPerPage: 3,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  facetFilters: [
    'moderationStatus:ACTIVE',
    'isHidden:false',
    ['socialVerificationFacet:INSTAGRAM', 'socialVerificationFacet:TWITTER'],
  ],
};
