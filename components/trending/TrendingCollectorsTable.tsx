import { config } from 'stitches.config';
import { useState } from 'react';
import { useMedia } from 'react-use';

import DataTable from 'components/data-table/DataTable';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import {
  getTimeFilterPrefix,
  getTrendingCollectorOrderByField,
} from 'utils/trending';

import useTrendingCollectors from 'hooks/queries/hasura/use-trending-collectors';
import useInfiniteData from 'hooks/use-infinite-data';

import {
  TrendingCollectorColumn,
  TrendingCollector,
  TimeFilter,
} from 'types/Trending';
import TrendingCollectorColumns from './TrendingCollectorsColumns';

interface TrendingCollectorsTableProps {
  activeTimeFilter: TimeFilter;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TrendingCollectorsTable(
  props: TrendingCollectorsTableProps
) {
  const { activeTimeFilter } = props;

  const [activeColumn, setActiveColumn] = useState(
    TrendingCollectorColumn.TotalSpent
  );

  const orderByField = getTrendingCollectorOrderByField({
    timeFilter: activeTimeFilter,
    orderByColumn: activeColumn,
  });

  const { data, isLoading } = useTrendingCollectors({
    orderByField,
  });

  const flattenedData = useInfiniteData(data, 'user');

  // This will filter out rows with 0 as amount of NFTS bought
  // The getTimeFilterPrefix function ensures we are filtering our against the correct time interval that is currently active
  const onlyDataWithSales = flattenedData.filter((d) => {
    const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumBought`;
    return d[queryField] > 0;
  });

  const isMobile = !useMedia(config.media.bp2);

  const columns = TrendingCollectorColumns(activeTimeFilter, isMobile);

  return (
    <DataTable<TrendingCollector>
      isLoading={isLoading}
      data={onlyDataWithSales}
      columns={columns}
      initialState={{
        sortBy: [{ id: TrendingCollectorColumn.TotalSpent }],
      }}
      onSortBy={(sort) => {
        const sortColumn = TrendingCollectorColumn[sort[0].id];
        setActiveColumn(sortColumn);
      }}
      getLink={(props) => {
        const { original } = props;
        return buildUserProfilePath({ user: original.user });
      }}
      hiddenMobileCols={[
        {
          id: TrendingCollectorColumn.CreatorsSupported,
          label: 'Creators Supported',
        },
        { id: TrendingCollectorColumn.NftsBought, label: 'NFTs Bought' },
        {
          id: TrendingCollectorColumn.TotalSpent,
          label: 'Total Spent',
        },
      ]}
      defaultMobileCol={{
        id: TrendingCollectorColumn.TotalSpent,
        label: 'Total Spent',
      }}
    />
  );
}
