import { gql } from 'graphql-request';
import { fndHasuraClient } from 'lib/clients/graphql';
import { TrendingCollector } from 'types/Trending';
import { HasuraUserFragmentLight } from './hasura-fragments';

interface GetTrendingCollectorsArgs {
  orderByField: string;
  limit: number;
  offset: number;
}

const TRENDING_COLLECTORS_QUERY = gql`
  query TrendingCollectorsQuery(
    $orderBy: trending_collector_order_by!
    $offset: Int!
    $limit: Int!
  ) @cached(ttl: 300) {
    trendingCollectors: trending_collector(
      order_by: [$orderBy]
      offset: $offset
      limit: $limit
    ) {
      oneDayCreatorsSupported
      oneDayNumBought
      oneDaySpent

      oneWeekCreatorsSupported
      oneWeekNumBought
      oneWeekSpent

      oneMonthCreatorsSupported
      oneMonthNumBought
      oneMonthSpent

      totalCreatorsSupported
      totalNumBought
      totalSpent

      user {
        ...HasuraUserFragmentLight
      }
    }
  }

  ${HasuraUserFragmentLight}
`;

export async function getTrendingCollectors({
  orderByField,
  limit,
  offset,
}: GetTrendingCollectorsArgs): Promise<TrendingCollector[]> {
  const client = fndHasuraClient();

  const { trendingCollectors } = await client.request<{
    trendingCollectors: TrendingCollector[];
  }>(TRENDING_COLLECTORS_QUERY, {
    orderBy: { [orderByField]: 'desc' },
    limit,
    offset,
  });

  return trendingCollectors;
}
