import { FunctionComponent } from 'react';

import { SearchResponse } from '@algolia/client-search';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';

import { isEmptyOrNil } from 'utils/helpers';

type BasicHit<T> = {
  hit: unknown;
  onClick: (arg0: T) => void;
};

interface SearchResultsProps<T> {
  title: string;
  currentValue: string;
  results: SearchResponse<T>;
  component: FunctionComponent<BasicHit<T>>;
  onClick: (arg0: T) => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function SearchResultsV2<T>(props: SearchResultsProps<T>) {
  const { results, component: Component, title, onClick } = props;

  const noResults = isEmptyOrNil(results.hits);

  if (noResults) {
    return null;
  }

  return (
    <Grid css={{ gap: '$2' }}>
      <Heading css={{ color: '$black50' }}>{title}</Heading>
      <Grid css={{ gap: 0 }}>
        {results.hits.map((hit) => (
          <Component key={hit.objectID} hit={hit} onClick={onClick} />
        ))}
      </Grid>
    </Grid>
  );
}
