import * as Types from '../types-server.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type SuggestedTagsCountsVariables = Types.Exact<{ [key: string]: never; }>;


export type SuggestedTagsCounts = { getCachedSuggestedTagCounts: Array<Pick<Types.TagsCount, 'tag' | 'count'>> };


export const SuggestedTagsCountsDocument = /*#__PURE__*/ `
    query SuggestedTagsCounts {
  getCachedSuggestedTagCounts {
    tag
    count
  }
}
    `;
export const useSuggestedTagsCounts = <
      TData = SuggestedTagsCounts,
      TError = Error
    >(
      variables?: SuggestedTagsCountsVariables, 
      options?: UseQueryOptions<SuggestedTagsCounts, TError, TData>
    ) => 
    useQuery<SuggestedTagsCounts, TError, TData>(
      ['SuggestedTagsCounts', variables],
      useServerFetcher<SuggestedTagsCounts, SuggestedTagsCountsVariables>(SuggestedTagsCountsDocument).bind(null, variables),
      options
    );
useSuggestedTagsCounts.getKey = (variables?: SuggestedTagsCountsVariables) => ['SuggestedTagsCounts', variables];
