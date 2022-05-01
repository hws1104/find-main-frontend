import { config } from 'stitches.config';
import { useState } from 'react';
import { useMedia } from 'react-use';

import DataTable from 'components/data-table/DataTable';

import {
  getTimeFilterPrefix,
  getTrendingCollectionOrderByField,
} from 'utils/trending';

import useTrendingCollections from 'hooks/queries/hasura/use-trending-collections';
import useInfiniteData from 'hooks/use-infinite-data';

import {
  TimeFilter,
  TrendingCollection,
  TrendingCollectionColumn,
} from 'types/Trending';
import TrendingCollectionsColumns from './TrendingCollectionsColumns';
import { buildCollectionPath } from 'utils/collections';

interface TrendingCollectionsTableProps {
  activeTimeFilter: TimeFilter;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TrendingCollectionsTable(
  props: TrendingCollectionsTableProps
) {
  const { activeTimeFilter } = props;

  const [activeColumn, setActiveColumn] = useState(
    TrendingCollectionColumn.TotalSales
  );

  const orderByField = getTrendingCollectionOrderByField({
    timeFilter: activeTimeFilter,
    orderByColumn: activeColumn,
  });

  const { data, isLoading } = useTrendingCollections({
    orderByField,
  });

  const flattenedData = useInfiniteData(data, 'collection');

  const onlyDataWithSales = flattenedData.filter((d) => {
    const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumSold`;
    return d[queryField] > 0;
  });

  const isMobile = !useMedia(config.media.bp2);

  const columns = TrendingCollectionsColumns(activeTimeFilter, isMobile);

  return (
    <DataTable<TrendingCollection>
      isLoading={isLoading}
      data={onlyDataWithSales}
      columns={columns}
      initialState={{
        sortBy: [{ id: TrendingCollectionColumn.TotalSales }],
      }}
      onSortBy={(sort) => {
        const sortColumn = TrendingCollectionColumn[sort[0].id];
        setActiveColumn(sortColumn);
      }}
      getLink={(props) => {
        const { original } = props;
        if (!original?.collection) {
          return null;
        }
        return buildCollectionPath(original?.collection);
      }}
      hiddenMobileCols={[
        {
          id: TrendingCollectionColumn.Owners,
          label: 'Owners',
        },
        {
          id: TrendingCollectionColumn.NftsSold,
          label: 'NFTs Sold',
        },
        {
          id: TrendingCollectionColumn.PrimarySales,
          label: 'Primary Sales',
        },
        {
          id: TrendingCollectionColumn.SecondarySales,
          label: 'Secondary Sales',
        },
        { id: TrendingCollectionColumn.TotalSales, label: 'Total Volume' },
      ]}
      defaultMobileCol={{
        id: TrendingCollectionColumn.TotalSales,
        label: 'Total Volume',
      }}
    />
  );
}
