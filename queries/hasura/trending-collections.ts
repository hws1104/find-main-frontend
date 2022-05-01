import { gql } from 'graphql-request';
import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { fndHasuraClient } from 'lib/clients/graphql';
import { TrendingCollection } from 'types/Trending';

interface GetTrendingCollectionsArgs {
  orderByField: string;
  limit: number;
  offset: number;
}

const TRENDING_COLLECTIONS_QUERY = gql`
  query TrendingCollectionsQuery(
    $orderBy: trending_collection_order_by!
    $offset: Int!
    $limit: Int!
  ) @cached(ttl: 300) {
    trendingCollections: trending_collection(
      order_by: [$orderBy]
      offset: $offset
      limit: $limit
      where: { collection: { isIndexed: { _eq: true } } }
    ) {
      oneDayVol
      oneDayNumSold
      oneDayCollectors
      oneDayPrimaryVol
      oneDaySecondaryVol

      oneWeekVol
      oneWeekNumSold
      oneWeekCollectors
      oneWeekPrimaryVol
      oneWeekSecondaryVol

      oneMonthVol
      oneMonthNumSold
      oneMonthCollectors
      oneMonthPrimaryVol
      oneMonthSecondaryVol

      totalVol
      totalNumSold
      totalCollectors
      totalPrimaryVol
      totalSecondaryVol

      collection {
        ...CollectionFragmentExtended
      }
    }
  }

  ${CollectionFragmentExtended}
`;

export async function getTrendingCollections({
  orderByField,
  limit,
  offset,
}: GetTrendingCollectionsArgs): Promise<TrendingCollection[]> {
  const client = fndHasuraClient();

  const { trendingCollections } = await client.request<{
    trendingCollections: TrendingCollection[];
  }>(TRENDING_COLLECTIONS_QUERY, {
    orderBy: { [orderByField]: 'desc' },
    limit,
    offset,
  });

  return trendingCollections;
}
