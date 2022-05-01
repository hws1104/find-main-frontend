import { connectStats } from 'react-instantsearch-dom';
import { StatsProvided } from 'react-instantsearch-core';
import { pluralizeWord } from 'utils/strings';

interface SearchResultsCountProps extends StatsProvided {
  label: string;
}

const SearchResultsCount = connectStats<SearchResultsCountProps>(
  ({ nbHits, label }) => {
    return (
      <>
        {nbHits} {pluralizeWord(label, nbHits)}
      </>
    );
  }
);

export default SearchResultsCount;
