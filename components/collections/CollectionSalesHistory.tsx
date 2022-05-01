/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  useFlexLayout,
  useTable,
  UseTableOptions,
  useSortBy,
  SortingRule,
} from 'react-table';
import { useVirtual } from 'react-virtual';
import { cond, equals } from 'ramda';
import { useMedia } from 'react-use';
import NextLink from 'next/link';

import { CollectionSalesHistory } from 'graphql/hasura/queries/collection-sales-history.generated';

import { isEmptyOrNil } from 'utils/helpers';
import { formatETHWithSuffix } from 'utils/formatters';

import { timeAgoInWords } from 'utils/dates/dates';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { buildArtworkPath } from 'utils/artwork/artwork';

import { useFlattenedInfiniteData } from 'hooks/use-infinite-data';
import useCollectionSalesHistory from 'hooks/queries/hasura/collections/use-collection-sales-history';
import useFetchVirtualizedData from 'hooks/use-fetch-virtualized-data';

import PopoverUserPill from 'components/popover/PopoverUserPill';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Avatar, { AvatarProps } from 'components/base/Avatar';
import SpinnerStroked from 'components/SpinnerStroked';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import TableHeader from 'components/data-table/TableHeader';
import TableCellText from 'components/data-table/TableCellText';
import { ActivityIndicator } from 'components/feed/InfiniteScrollButton';

import { config, styled } from 'stitches.config';

type SalesHistoryItem = CollectionSalesHistory['collectionSalesHistory'][0];

interface CollectionSalesHistoryProps {
  contractAddress: string;
}

type TableOptions = UseTableOptions<SalesHistoryItem>;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionSalesHistoryTable(
  props: CollectionSalesHistoryProps
) {
  const { contractAddress } = props;

  const isMobile = useMedia(config.media['bp2-max']);

  const parentRef = useRef();

  const {
    data: collectionSalesHistoryData,
    isLoading: isCollectionSalesLoading,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useCollectionSalesHistory({ contractAddress: contractAddress });

  const salesData = useFlattenedInfiniteData(collectionSalesHistoryData);

  const rowVirtualizer = useVirtual({
    size: salesData.length,
    parentRef,
    estimateSize: useCallback(() => (isMobile ? 58 : 92), [isMobile]),
    overscan: 5,
  });

  useFetchVirtualizedData({
    data: salesData,
    virtualItems: rowVirtualizer.virtualItems,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { rows, headerGroups, getTableProps, prepareRow, setHiddenColumns } =
    useTable<SalesHistoryItem>(
      {
        initialState: {
          sortBy: useMemo(() => [{ id: 'dateSold', desc: true }], []),
        },
        data: salesData,
        columns: useMemo<TableOptions['columns']>(
          () => [
            {
              Header: 'Artwork',
              accessor: 'artwork',
              Cell: ({ value }) => (
                <ArtworkTableCell isMobile={isMobile} artwork={value} />
              ),
              minWidth: isMobile ? null : 180,
              maxWidth: isMobile ? 120 : 200,
            },
            {
              Header: 'From',
              accessor: 'seller',
              Cell: ({ value }) => <UserTableCell user={value} />,
              disableSortBy: true,
            },
            {
              Header: 'To',
              accessor: 'buyer',
              Cell: ({ value }) => <UserTableCell user={value} />,
              disableSortBy: true,
            },
            {
              Header: 'Type',
              accessor: 'eventType',
              Cell: ({ value }) => (
                <TableCellText value={formatEventType(value)} />
              ),
              maxWidth: isMobile ? 60 : 80,
              disableSortBy: true,
            },
            {
              Header: 'Bids',
              accessor: 'numBids',
              Cell: ({ value }) => <TableCellText value={value || '—'} />,
              maxWidth: 80,
            },
            {
              Header: 'Price',
              accessor: 'priceLastSoldFor',
              Cell: ({ value }) => (
                <TableCellText
                  value={formatETHWithSuffix(value)}
                  css={{ whiteSpace: 'nowrap' }}
                />
              ),
              maxWidth: isMobile ? 80 : 100,
            },
            {
              Header: 'Date',
              accessor: 'dateSold',
              Cell: ({ value }) => (
                <Text
                  css={{ whiteSpace: 'nowrap' }}
                  size={{ '@initial': 0, '@bp2': 1 }}
                  weight={600}
                >
                  {timeAgoInWords(value, isMobile ? 'short' : 'long')}
                </Text>
              ),
              maxWidth: isMobile ? 50 : 100,
            },
          ],
          []
        ),
      },
      useSortBy,
      useFlexLayout
    );

  useEffect(() => {
    setHiddenColumns(
      isMobile ? ['eventType', 'buyer', 'seller', 'numBids'] : []
    );
  }, [setHiddenColumns, isMobile]);

  const noResults = isEmptyOrNil(salesData);

  if (isCollectionSalesLoading) {
    return (
      <Flex
        css={{
          height: 340,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SpinnerStroked size={32} />
      </Flex>
    );
  }

  if (noResults) {
    return (
      <Box
        css={{
          paddingBottom: '$6',
          '@bp2': { paddingY: '$8' },
        }}
      >
        <HistoryTableHeading size={3}>Sales History</HistoryTableHeading>
        <TableHeader headerGroups={headerGroups} />
        <TableContainer
          css={{
            display: 'flex',
            height: 340,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box css={{ textAlign: 'center' }}>
            <Heading size={4} css={{ marginBottom: '$4' }}>
              No sales to show yet.
            </Heading>
            <Paragraph css={{ maxWidth: 320 }}>
              The sales history of this collection will be displayed here.
            </Paragraph>
          </Box>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box
      css={{
        paddingBottom: '$6',
        '@bp2': { paddingY: '$8' },
      }}
    >
      <HistoryTableHeading size={3}>Sales History</HistoryTableHeading>
      <TableHeader headerGroups={headerGroups} />
      <Box {...getTableProps()}>
        <TableContainer
          ref={parentRef}
          style={{ height: isMobile ? 540 : 760 }}
        >
          <Box
            // dynamic values so use style prop
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];

              prepareRow(row);

              return (
                <TableRowVirtualized
                  {...row.getRowProps()}
                  key={virtualRow.index}
                  // dynamic values so use style prop
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <NextLink
                    href={buildArtworkPath({
                      artwork: row.original.artwork,
                      user: row.original.artwork.creator,
                    })}
                    passHref
                  >
                    <a
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    ></a>
                  </NextLink>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        key={cell.getCellProps().key}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRowVirtualized>
              );
            })}
          </Box>
        </TableContainer>
      </Box>
      <ActivityIndicator isActive={isFetching} />
    </Box>
  );
}

const HistoryTableHeading = styled(Heading, {
  marginBottom: '$7',
  '@bp2': {
    marginBottom: '$8',
  },
});

const TableContainer = styled(Box, {
  border: 'solid 1px $black5',
  borderRadius: '$2',
  width: '100%',
  overflow: 'auto',
});

const TableCell = styled(Box, {
  paddingX: '$3',
  '@bp2': {
    paddingX: '$5',
  },
});

const TableRowVirtualized = styled(Box, {
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  alignItems: 'center',
  '&:not(:last-of-type)': {
    borderBottom: 'solid 1px $black5',
  },
  paddingY: '$3',
  '@bp2': {
    paddingY: '$5',
  },
});

interface UserTableCellProps {
  user: SalesHistoryItem['seller'];
}

function UserTableCell(props: UserTableCellProps) {
  const { user } = props;
  return (
    <Box css={{ position: 'relative', zIndex: 2 }}>
      <PopoverUserPill
        type="uncontained"
        publicKey={user.publicKey}
        user={user}
      />
    </Box>
  );
}

interface ArtworkTableCellProps {
  artwork: SalesHistoryItem['artwork'];
  isMobile: boolean;
}

function ArtworkTableCell(props: ArtworkTableCellProps) {
  const { artwork, isMobile } = props;

  const posterImageUrl = buildPosterUrl(artwork, {
    bg: 'F2F2F2',
    w: 128,
    fm: 'jpg',
  });
  const assetImageUrl = buildArtworkAssetUrl({ w: 128, fm: 'jpg' }, artwork);

  return (
    <Flex css={{ alignItems: 'center' }}>
      <ArtworkAvatar
        imageUrl={posterImageUrl || assetImageUrl}
        shape={2}
        css={{ marginRight: '$4' }}
      />

      <Text
        size={{
          '@initial': 0,
          '@bp2': 2,
        }}
        weight={600}
        css={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {artwork.name}
      </Text>
    </Flex>
  );
}

const formatEventType = cond([
  [equals('auction'), () => 'Auction'],
  [equals('private_sale'), () => 'Private Sale'],
]);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function ArtworkAvatar(props: AvatarProps) {
  return (
    <Avatar
      {...props}
      css={{
        width: 32,
        height: 32,
        marginRight: '$2',
        '@bp2': {
          width: 50,
          height: 50,
          marginRight: '$5',
        },
      }}
    />
  );
}
