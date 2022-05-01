import { useState, useEffect } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import { StateResultsProvided } from 'react-instantsearch-core';

import Box from 'components/base/Box';

import { styled } from 'stitches.config';
import GraySquare from 'components/base/GraySquare';
import Grid from 'components/base/Grid';

const FiltersContainer = styled(Box, {
  display: 'none',
  '@bp2': {
    display: 'block',
    position: 'sticky',
    top: 0,
    left: 0,
    alignSelf: 'flex-start',
    paddingTop: '$6',
    marginTop: '-$6',
    overflow: 'auto',
    height: '100vh',
    paddingBottom: '$7',
    paddingRight: '$6',
    paddingLeft: '$3',
    marginLeft: '-$3',
  },
});

export const SearchFiltersContainer = connectStateResults<StateResultsProvided>(
  ({ isSearchStalled, children }) => {
    const [isStalled, setIsStalled] = useState(true);

    useEffect(() => {
      if (!isSearchStalled) {
        setIsStalled(false);
      }
    }, [isSearchStalled]);

    if (isStalled) {
      return <SearchFiltersLoadingSkeleton />;
    }

    return <FiltersContainer>{children}</FiltersContainer>;
  }
);

export default SearchFiltersContainer;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function InputSkeleton() {
  return (
    <GraySquare
      css={{
        height: 54,
        width: '100%',
        borderRadius: '$2',
        backgroundColor: '$black5',
      }}
    />
  );
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function SearchFiltersLoadingSkeleton() {
  return (
    <FiltersContainer>
      <GraySquare css={{ width: 120, height: 22, marginBottom: '$7' }} />
      <Grid
        css={{ gridTemplateColumns: '1fr 1fr', gap: '$3', marginBottom: '$4' }}
      >
        {[...Array(2)].map((_, index) => (
          <InputSkeleton key={index} />
        ))}
      </Grid>
      <GraySquare
        css={{
          height: 60,
          width: '100%',
          borderRadius: '$2',
          marginBottom: '$7',
          backgroundColor: '$black5',
        }}
      />
      <Box css={{ paddingTop: '$7' }}>
        <GraySquare css={{ width: 120, height: 22, marginBottom: '$7' }} />
        <Grid css={{ gap: '$3' }}>
          {[...Array(3)].map((_, index) => (
            <InputSkeleton key={index} />
          ))}
        </Grid>
      </Box>
    </FiltersContainer>
  );
}
