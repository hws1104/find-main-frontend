import { HeaderGroup } from 'react-table';
import { useScrollbarWidth } from 'react-use';

import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { CSS, styled } from 'stitches.config';

interface TableHeaderProps<T extends Record<string, unknown>> {
  headerGroups: HeaderGroup<T>[];
  css?: CSS;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TableHeader<T extends Record<string, unknown>>(
  props: TableHeaderProps<T>
) {
  const sbw = useScrollbarWidth();

  const { headerGroups, css } = props;


  return (
    <Box
      style={{ paddingRight: sbw }}
      css={{
        ...(css as any),
        '@bp2': {
          marginBottom: '$2',
        },
      }}
    >
      <Box>
        {headerGroups.map((headerGroup) => (
          <Box
            {...headerGroup.getHeaderGroupProps()}
            key={headerGroup.getHeaderGroupProps().key}
          >
            {headerGroup.headers.map((column) => (
              <ColumnHeader
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.getHeaderProps().key}
                isDisabled={column.disableSortBy}
                isSorted={column.isSorted}
                weight={600}
                size={1}
              >
                {column.render('Header')}
                {!column.disableSortBy && (
                  <ColumnHeaderText isSorted={column.isSorted}>
                    {column.isSortedDesc ? '↓' : '↑'}
                  </ColumnHeaderText>
                )}
              </ColumnHeader>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const ColumnHeaderText = styled(Text, {
  marginLeft: '$2',
  opacity: 0,
  transition: 'opacity $ease $1',
  color: 'inherit',
  variants: {
    isSorted: {
      true: { opacity: 1 },
    },
  },
});

const ColumnHeader = styled(Text, {
  color: '$black60',
  paddingBottom: '$3',
  display: 'flex',
  paddingX: '$3',
  transition: 'opacity $ease $1',
  variants: {
    isSorted: {
      true: {
        color: '$black100',
        [`&:hover ${ColumnHeaderText}`]: {
          opacity: 1,
        },
      },
    },
    isDisabled: {
      true: {
        cursor: 'not-allowed',
        color: '$black60 !important',
      },
    },
  },
  '@bp2': {
    paddingX: '$5',
  },
  '@hover': {
    '&:hover': {
      // color: '$black100',
    },
    [`&:hover ${ColumnHeaderText}`]: {
      opacity: 0.5,
    },
  },
});
