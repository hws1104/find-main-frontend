import Chiclet from 'components/Chiclet';
import { TimeFilter } from 'types/Trending';

interface TrendingTimeFiltersProps {
  setCurrentTimeFilter: (currentTimeFilter: TimeFilter) => void;
  currentTimeFilter: TimeFilter;
}

export default function TrendingTimeFilters(
  props: TrendingTimeFiltersProps
): JSX.Element {
  const { setCurrentTimeFilter, currentTimeFilter } = props;

  return (
    <>
      <Chiclet
        label="1d"
        onClick={() => setCurrentTimeFilter(TimeFilter.OneDay)}
        isActive={currentTimeFilter === TimeFilter.OneDay}
      />

      <Chiclet
        label="7d"
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.SevenDay)}
        isActive={currentTimeFilter === TimeFilter.SevenDay}
      />

      <Chiclet
        label="30d"
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.ThirtyDay)}
        isActive={currentTimeFilter === TimeFilter.ThirtyDay}
      />

      <Chiclet
        label="All Time"
        css={{ marginLeft: '$2' }}
        onClick={() => setCurrentTimeFilter(TimeFilter.AllTime)}
        isActive={currentTimeFilter === TimeFilter.AllTime}
      />
    </>
  );
}
