import {
  connectInfiniteHits,
  connectStateResults,
} from 'react-instantsearch-dom';
import { StateResultsProvided } from 'react-instantsearch-core';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';

import Box from 'components/base/Box';
import CardGrid from 'components/CardGrid';
import ArtworkCardSearch from 'components/cards/artwork/ArtworkCardSearch';
import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';

import useSearchLoadingState from 'hooks/use-search-loading-state';

function ArtworkLoadingSkeleton() {
  return (
    <CardGrid>
      {[...Array(8)].map((_, index) => (
        <ArtworkCardSkeleton key={index} />
      ))}
    </CardGrid>
  );
}

export const ArtworkSearchResultsContainer =
  connectStateResults<StateResultsProvided>(({ children, isSearchStalled }) => {
    const [isStalled, setIsStalled] = useState(true);

    useEffect(() => {
      if (!isSearchStalled) {
        setIsStalled(false);
      }
    }, [isSearchStalled]);

    return (
      <>
        <Box style={{ display: isStalled ? 'block' : 'none' }}>
          <ArtworkLoadingSkeleton />
        </Box>
        {/* TODO: add no results empty state */}
        {/* <Box style={{ display: !hasResults ? 'block' : 'none' }}></Box> */}
        <Box style={{ display: !isStalled ? 'block' : 'none' }}>{children}</Box>
      </>
    );
  });

const ArtworkSearchResults = connectInfiniteHits((props): JSX.Element => {
  const { hits, hasMore, refineNext } = props;

  useSearchLoadingState({ results: hits });

  const [isFetching, setIsFetching] = useState(false);

  const handleNextPage = useCallback(() => {
    setIsFetching(true);
    refineNext();
  }, [setIsFetching, refineNext]);

  useEffect(
    () => {
      if (isFetching) {
        setIsFetching(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hits]
  );
  return (
    <Box css={{ paddingBottom: '$8' }}>
      <CardGrid>
        {hits.map((hit, index) => (
          <ArtworkCardSearch key={index} artwork={hit} />
        ))}
      </CardGrid>

      <InfiniteScrollButton
        key={hits.length}
        handleNextPage={handleNextPage}
        hasNextPage={hasMore}
        isFetching={isFetching}
        animationDuration={0.05}
      />
    </Box>
  );
});

export default ArtworkSearchResults;
