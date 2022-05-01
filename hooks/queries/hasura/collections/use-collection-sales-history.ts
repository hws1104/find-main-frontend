import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';

import {
  CollectionSalesHistory,
  CollectionSalesHistoryDocument,
  CollectionSalesHistoryVariables,
} from 'graphql/hasura/queries/collection-sales-history.generated';

import { isAllTrue } from 'utils/helpers';
import { getNextPageParam } from 'utils/artwork/artwork';
import { isQueryEnabled } from 'hooks/queries/shared';

import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';
import { fndHasuraClient } from 'lib/clients/graphql';
import { OmitPagination } from 'types/utils';

type SalesHistoryItem = CollectionSalesHistory['collectionSalesHistory'][0];

async function getCollectionSalesHistory(
  variables: CollectionSalesHistoryVariables
) {
  const client = fndHasuraClient();
  const query = await client.request<
    CollectionSalesHistory,
    CollectionSalesHistoryVariables
  >(CollectionSalesHistoryDocument, variables);
  return query.collectionSalesHistory;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCollectionSalesHistory(
  variables: OmitPagination<CollectionSalesHistoryVariables>,
  options?: UseInfiniteQueryOptions<
    SalesHistoryItem[],
    Error,
    SalesHistoryItem[]
  >
) {
  return useInfiniteQuery(
    useCollectionSalesHistory.getKey(variables),
    ({ pageParam = 0 }) =>
      getCollectionSalesHistory({
        ...variables,
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    {
      ...options,
      getNextPageParam,
      enabled: isAllTrue([isQueryEnabled(options), Object.values(variables)]),
    }
  );
}

useCollectionSalesHistory.getKey = (
  variables: OmitPagination<CollectionSalesHistoryVariables>
) => ['CollectionSalesHistory', variables];
