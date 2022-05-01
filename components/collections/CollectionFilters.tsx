import { useState } from 'react';
import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import SelectField from 'components/forms/fields/SelectField';
import Chiclet from 'components/Chiclet';
import { formatInteger } from 'utils/formatters';

const Count = styled(Box, { display: 'inline-block', marginLeft: '$2' });

export enum CollectionFilter {
  All = 'All',
  Available = 'Available',
  Sold = 'Sold',
}

export enum CollectionSort {
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc',
  DateMintedAsc = 'DateMintedAsc',
  DateMintedDesc = 'DateMintedDesc',
}

export interface HandleSetFilterAndSortArgs {
  filter: CollectionFilter;
  sort: CollectionSort;
}

const sortItems = [
  {
    id: CollectionSort.DateMintedDesc,
    label: 'Date Minted - Newest',
  },
  {
    id: CollectionSort.DateMintedAsc,
    label: 'Date Minted - Oldest',
  },
  {
    id: CollectionSort.PriceDesc,
    label: 'Price - Highest',
  },
  {
    id: CollectionSort.PriceAsc,
    label: 'Price - Lowest',
  },
];

interface CollectionFiltersProps {
  onChange: (arg0: HandleSetFilterAndSortArgs) => void;
  defaultFilter: CollectionFilter;
  defaultSort: CollectionSort;
  artworksTotalCount: number;
  availableCount: number;
  soldCount: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function CollectionFilters(props: CollectionFiltersProps) {
  const {
    onChange,
    defaultFilter,
    defaultSort,
    artworksTotalCount,
    availableCount,
    soldCount,
  } = props;

  const [filter, setFilter] = useState(defaultFilter);
  const [sort, setSort] = useState(defaultSort);

  const handleFilterOnChange = (filter: CollectionFilter) => {
    setFilter(filter);
    onChange({ filter, sort });
  };

  const handleSortOnChange = (sort: CollectionSort) => {
    setSort(sort);
    onChange({ filter, sort });
  };

  return (
    <Flex
      css={{
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginX: 'auto',
        marginTop: '$3',
        marginBottom: '$7',
        '@bp0': { marginX: 0 },
      }}
    >
      <Flex css={{ alignItems: 'center' }}>
        <Chiclet
          label="All"
          count={artworksTotalCount && formatInteger(artworksTotalCount)}
          isActive={CollectionFilter.All === filter}
          onClick={() => handleFilterOnChange(CollectionFilter.All)}
        />

        <Chiclet
          label="Available"
          count={availableCount && formatInteger(availableCount)}
          isActive={CollectionFilter.Available === filter}
          onClick={() => handleFilterOnChange(CollectionFilter.Available)}
          css={{ marginLeft: '$2' }}
        />

        <Chiclet
          label="Sold"
          count={soldCount && formatInteger(soldCount)}
          isActive={CollectionFilter.Sold === filter}
          onClick={() => handleFilterOnChange(CollectionFilter.Sold)}
          css={{ marginLeft: '$2' }}
        />
      </Flex>
      <Flex
        css={{
          flexBasis: '100%',
          marginTop: '$4',
          '@bp1': {
            marginTop: 0,
            flexBasis: 'auto',
          },
        }}
      >
        <SelectField
          items={sortItems}
          defaultSelectedItem={sortItems.find((item) => item.id === sort)}
          onSelectedItemChange={({ id }) => handleSortOnChange(id)}
        />
      </Flex>
    </Flex>
  );
}
