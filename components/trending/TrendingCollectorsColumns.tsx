import { styled, css } from 'stitches.config';
import { CellProps } from 'react-table';

import { formatETHWithSuffix } from 'utils/formatters';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import ETHinUSD from 'components/ETHinUSD';
import FollowPopover from 'components/follows/FollowPopover';
import TrendingName from './TrendingName';
import TrendingUsername from './TrendingUsername';
import SingleValue from './SingleValue';
import SubValue from './SubValue';
import RankValue from './RankValue';
import {
  TimeFilter,
  TrendingCollector,
  TrendingCollectorColumn,
} from 'types/Trending';
import CircleAvatar from 'components/avatars/CircleAvatar';
import {
  getUsernameOrTruncatedAddress,
  hasUsername,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { getTimeFilterPrefix } from 'utils/trending';

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

const popoverStyles = css({
  position: 'relative',
  zIndex: 3,
  display: 'flex',
})();

export default function TrendingCollectorColumns(
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
      Cell: function RankCell({ row, column }: CellProps<TrendingCollector>) {
        if (isMobile) {
          column.width = 40;
        }

        return <RankValue>#{row.index + 1}</RankValue>;
      },
    },
    {
      id: 'user',
      width: 250,
      Cell: function UserCell({ row, column }: CellProps<TrendingCollector>) {
        const {
          original: { user },
        } = row;

        if (isMobile) {
          column.width = 180;
        }

        const userHasUsername = hasUsername(user);
        const userHasName = user.name;
        const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);

        return (
          <FollowPopover
            publicKey={publicKeyOrIdOrAddress(user)}
            className={popoverStyles}
          >
            <Flex
              css={{
                maxWidth: 160,
                alignItems: 'center',
                '@bp0': {
                  maxWidth: 300,
                },
              }}
            >
              <CircleAvatar
                maxSize={50}
                css={{
                  width: 30,
                  height: 30,
                  '@bp2': { width: 50, height: 50 },
                }}
                publicKey={user.publicKey}
                imageUrl={user.profileImageUrl}
              />
              <Box
                css={{
                  marginLeft: '$3',
                  overflow: 'hidden',
                  '@bp1': { marginLeft: '$5' },
                }}
              >
                {userHasName && <TrendingName>{user.name}</TrendingName>}
                <Flex>
                  <TrendingUsername
                    color={userHasUsername ? 'rainbow' : null}
                    hasNoUsername={!userHasUsername}
                    hasNoName={!userHasName}
                  >
                    {usernameOrTruncatedAddress}
                  </TrendingUsername>
                </Flex>
              </Box>
            </Flex>
          </FollowPopover>
        );
      },
    },
    {
      id: TrendingCollectorColumn.CreatorsSupported,
      canSort: true,
      width: 150,
      Header: function SupportedHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollector>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            Creators Supported
          </Header>
        );
      },
      Cell: function SupportedCell({
        row: { original },
      }: CellProps<TrendingCollector>) {
        const queryField = `${getTimeFilterPrefix(
          activeTimeFilter
        )}CreatorsSupported`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectorColumn.NftsBought,
      canSort: true,
      width: 100,
      Header: function NftsBoughtHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollector>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            NFTs Bought
          </Header>
        );
      },
      Cell: function BoughtCell({
        row: { original },
      }: CellProps<TrendingCollector>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumBought`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCollectorColumn.TotalSpent,
      canSort: true,
      Header: function TotalSpentHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCollector>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Total Spent
          </Header>
        );
      },
      Cell: function TotalSpentHeader({
        row: { original },
        column,
      }: CellProps<TrendingCollector>) {
        if (isMobile) {
          column.width = 100;
        }
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Spent`;
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
