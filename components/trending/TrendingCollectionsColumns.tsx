/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { styled } from 'stitches.config';
import { CellProps } from 'react-table';

import { formatETHWithSuffix } from 'utils/formatters';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import { SquareAvatar } from 'components/base/Avatar';
import ETHinUSD from 'components/ETHinUSD';
import TrendingName from './TrendingName';
import TrendingUsername from './TrendingUsername';
import SingleValue from './SingleValue';
import SubValue from './SubValue';
import RankValue from './RankValue';
import CollectionPopover from 'components/collections/CollectionPopover';

import {
  TimeFilter,
  TrendingCollection,
  TrendingCollectionColumn,
} from 'types/Trending';
import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { getTimeFilterPrefix } from 'utils/trending';
import { buildAvatarUrl } from 'utils/assets';

const Header = styled(Box, {
  display: 'none',
  fontFamily: '$body',
  fontWeight: 600,
  color: '$black60',
  fontSize: '$1',
  paddingX: '$2',
  cursor: 'pointer',
  '@bp2': { display: 'block' },
  variants: {
    isActive: { true: { color: '$black100' } },
  },
});

export default function TrendingCollectionsColumns(
  activeTimeFilter: TimeFilter,
  isMobile: boolean
) {
  return [
    {
      id: 'rank',
      width: 50,
      Header: function RankHeader() {
        return (
          <Box css={{ paddingLeft: '$4', '@bp2': { paddingLeft: '$2' } }}>
            Rank
          </Box>
        );
      },
      Cell: function RankCell({ row, column }: CellProps<TrendingCollection>) {
        if (isMobile) {
          column.width = 40;
        }

        return <RankValue>#{row.index + 1}</RankValue>;
      },
    },
    {
      id: 'user',
      width: 300,
      Cell: function UserCell({ row, column }: CellProps<TrendingCollection>) {
        if (isMobile) {
          column.width = 180;
        }
        const {
          original: { collection },
        } = row;

        const userHasUsername = hasUsername(collection.creator);
        const userHasName = collection.creator.name;
        const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(
          collection.creator
        );

        const collectionImageUrl = buildAvatarUrl(
          64,
          collection.collectionImageUrl
        );

        return (
          <CollectionPopover
            css={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              minWidth: 0,
              overflow: 'hidden',
            }}
            user={collection.creator}
            collection={collection}
          >
            <Flex css={{ alignItems: 'center' }}>
              <SquareAvatar
                imageUrl={collectionImageUrl}
                size={40}
                shape="2"
                css={{ '@bp1': { width: 60, height: 60 } }}
              />
              <Box
                css={{
                  marginLeft: '$3',
                  overflow: 'hidden',
                  minWidth: 0,
                  '@bp1': {
                    marginLeft: '$5',
                    paddingRight: '$7',
                  },
                }}
              >
                <TrendingName>{collection.name}</TrendingName>

                <TrendingUsername
                  color={userHasUsername ? 'rainbow' : null}
                  hasNoUsername={!userHasUsername}
                  hasNoName={!userHasName}
                >
                  {usernameOrTruncatedAddress}
                </TrendingUsername>
              </Box>
            </Flex>
          </CollectionPopover>
        );
      },
    },
    {
      id: TrendingCollectionColumn.Owners,
      canSort: true,
      width: 150,
      Header: function CollectorsHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollection>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            Owners
          </Header>
        );
      },
      Cell: function CollectorsCell({
        row: { original },
      }: CellProps<TrendingCollection>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Collectors`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectionColumn.NftsSold,
      canSort: true,
      width: 150,
      Header: function CollectorsHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollection>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            NFTs Sold
          </Header>
        );
      },
      Cell: function CollectorsCell({
        row: { original },
      }: CellProps<TrendingCollection>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumSold`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectionColumn.PrimarySales,
      canSort: true,
      Header: function PrimarySalesHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollection>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Primary Sales
          </Header>
        );
      },
      Cell: function PrimaryVolCell({
        row: { original },
      }: CellProps<TrendingCollection>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}PrimaryVol`;
        return (
          <Box css={{ textAlign: 'right' }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectionColumn.SecondarySales,
      canSort: true,
      Header: function SecondarySalesHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollection>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Secondary Sales
          </Header>
        );
      },
      Cell: function SecondaryVolCell({
        row: { original },
      }: CellProps<TrendingCollection>) {
        const queryField = `${getTimeFilterPrefix(
          activeTimeFilter
        )}SecondaryVol`;
        return (
          <Box css={{ textAlign: 'right' }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectionColumn.TotalSales,
      canSort: true,
      Header: function TotalVolHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollection>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Total Sales
          </Header>
        );
      },
      Cell: function TotalVolHeader({
        row: { original },
        column,
      }: CellProps<TrendingCollection>) {
        if (isMobile) {
          column.width = 100;
        }
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Vol`;
        return (
          <Box css={{ textAlign: 'right', '@bp2': { paddingRight: '$3' } }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
  ];
}
