import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';
import { ClientError } from 'graphql-request';

import { getNextPageParam } from 'utils/artwork/artwork';

import { getTrendingCollections } from 'queries/hasura/trending-collections';

import { QueryCacheKey } from 'types/Queries';
import { TrendingCollection } from 'types/Trending';

interface TrendingCollectionsArgs
  extends UseInfiniteQueryOptions<
    TrendingCollection[],
    ClientError,
    TrendingCollection[]
  > {
  orderByField: string;
  limit?: number;
}

export default function useTrendingCollections({
  orderByField,
  limit = 100,
  enabled = true,
  refetchOnWindowFocus = false,
}: TrendingCollectionsArgs): UseInfiniteQueryResult<
  TrendingCollection[],
  ClientError
> {
  return useInfiniteQuery(
    [QueryCacheKey.TrendingCollections, { orderByField }],
    ({ pageParam = 0 }) =>
      getTrendingCollections({
        orderByField,
        limit,
        offset: limit * pageParam,
      }),
    {
      enabled: Boolean(orderByField && enabled),
      getNextPageParam,
      refetchOnWindowFocus,
    }
  );
}
