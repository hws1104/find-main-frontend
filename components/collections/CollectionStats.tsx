/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import { UserStackInteractive } from 'components/follows/UserStack';

import {
  CollectionStats as ICollectionStats,
  useCollectionStats,
} from 'graphql/hasura/queries/collection-stats.generated';
import useModal from 'hooks/use-modal';

import {
  formatETHWithSuffix,
  formatInteger,
  withCeilToTwoDecimals,
} from 'utils/formatters';
import { nonZeroMin } from 'utils/numbers';
import { getFirstValue, notEmptyOrNil } from 'utils/helpers';

import { styled } from 'stitches.config';

import { ModalKey } from 'types/modal';

interface CollectionStatsProps {
  contractSlug: string;
  initialData: ICollectionStats;
}

export const CollectionStatsContainer = styled(Flex, {
  maxWidth: '$container',
  width: '100%',
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translate(-50%, 50%)',
  paddingX: '$6',
  zIndex: 1,
});

const StatWrapper = styled(Box, {
  paddingY: '$5',
  paddingLeft: '$6',
  paddingRight: '$6',
  '@bp2': {
    paddingY: '$7',
    paddingRight: '$7',
    paddingLeft: 0,
  },
});

const StatLabel = styled(Text, {
  color: '$black50',
  marginBottom: '$2',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  transition: 'color $1 $ease',
  '@bp2': {
    textAlign: 'left',
  },
});

const StatValue = styled(Text, {
  textAlign: 'center',
  '@bp2': {
    textAlign: 'left',
  },
});

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionStats(props: CollectionStatsProps) {
  const { contractSlug, initialData } = props;

  const { setCurrentModal } = useModal();

  const { data: collectionStatsData, isLoading: collectionStatsLoading } =
    useCollectionStats(
      { contractSlug: contractSlug },
      {
        enabled: Boolean(contractSlug),
        initialData,
        refetchOnWindowFocus: false,
      }
    );

  if (collectionStatsLoading || !initialData) {
    return null;
  }

  const collection = getFirstValue(collectionStatsData?.collection);

  const aggregates = {
    artwork: collection?.artworkAggregates,
    auctions: collection?.auctionAggregates,
    privateSales: collection?.privateSaleAggregates,
    floorPrice: collection?.floorPriceAggregates,
  };

  const artworksCount = aggregates.artwork?.aggregate?.count;
  const ownersCount = collection?.ownersCount?.aggregate?.count;
  const owners = collection?.owners
    ?.flatMap((user) => user.owner)
    .filter(notEmptyOrNil);

  const totalAuctionSales =
    aggregates.auctions?.aggregate?.sum?.highestBidAmount;
  const totalPrivateSales =
    aggregates.privateSales?.aggregate?.sum?.saleAmountInETH;

  // object of possible floor prices
  const floorPrices = {
    floorReservePrice: aggregates.floorPrice?.aggregate?.min?.reservePriceInETH,
    floorActiveBid: aggregates.floorPrice?.aggregate?.min?.highestBidAmount,
    floorLastSale: aggregates.artwork?.aggregate?.min?.lastSalePriceInETH,
    floorActiveSale: aggregates.artwork?.aggregate?.min?.activeSalePriceInETH,
    floorPrivateSale: aggregates.privateSales?.aggregate?.min?.saleAmountInETH,
  };

  // array with preferred floor prices
  const reserveAndActiveFloorPrices = [
    floorPrices.floorReservePrice,
    floorPrices.floorActiveSale,
    floorPrices.floorActiveBid,
  ];

  // array of last sales and private sales
  const lastSales = [floorPrices.floorLastSale, floorPrices.floorPrivateSale];

  // floor price is prioritizes reserveAndActiveFloorPrices over lastSales
  const floorPrice = nonZeroMin(reserveAndActiveFloorPrices)
    ? nonZeroMin(reserveAndActiveFloorPrices)
    : nonZeroMin(lastSales);

  const totalSales = totalPrivateSales + totalAuctionSales;

  return (
    <Box
      css={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        width: 'auto',
        backgroundColor: '$white100',
        borderRadius: '$2',
        boxShadow: '$1',
        marginX: 'auto',
        '@bp2': {
          display: 'flex',
          paddingX: '$7',
          marginX: 'unset',
          [`& ${StatWrapper}:last-child`]: {
            paddingRight: 0,
          },
        },
      }}
    >
      <StatWrapper
        css={{
          borderRight: '1px solid $black10',
          '@bp2': { borderRight: 'none' },
        }}
      >
        <StatLabel size={2} weight={600}>
          Collection of
        </StatLabel>
        <StatValue size={{ '@bpxs': 2, '@initial': 3 }} weight={600}>
          {formatInteger(artworksCount)}
        </StatValue>
      </StatWrapper>
      <StatWrapper
        css={{
          position: 'relative',
          '@hover': {
            [`&:hover ${StatLabel}`]: {
              color: '$black100',
            },
          },
        }}
      >
        <Box
          onClick={() => setCurrentModal(ModalKey.OWNED_BY)}
          css={{
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <StatLabel size={2} weight={600}>
          Owned by
        </StatLabel>
        <Flex
          css={{
            justifyContent: 'center',
            alignItems: 'center',
            '@bp2': { justifyContent: 'flex-start' },
          }}
        >
          <StatValue size={{ '@bpxs': 2, '@initial': 3 }} weight={600}>
            {formatInteger(ownersCount)}
          </StatValue>
          <Box
            css={{
              marginLeft: '$3',
              display: ' none',
              position: 'relative',
              zIndex: 2,
              '@bp2': {
                display: 'block',
              },
            }}
          >
            <UserStackInteractive users={owners} />
          </Box>
        </Flex>
      </StatWrapper>
      <StatWrapper
        css={{
          borderRight: '1px solid $black10',
          borderTop: '1px solid $black10',
          '@bp2': { borderRight: 'none', borderTop: 'none' },
        }}
      >
        <StatLabel size={2} weight={600}>
          Floor Price
        </StatLabel>
        <StatValue size={{ '@bpxs': 2, '@initial': 3 }} weight={600}>
          {floorPrice
            ? formatETHWithSuffix(withCeilToTwoDecimals(floorPrice))
            : '—'}
        </StatValue>
      </StatWrapper>
      <StatWrapper
        css={{
          borderTop: '1px solid $black10',
          '@bp2': { borderTop: 'none' },
        }}
      >
        <StatLabel size={2} weight={600}>
          Total Sales
        </StatLabel>
        <StatValue size={{ '@bpxs': 2, '@initial': 3 }} weight={600}>
          {totalSales
            ? formatETHWithSuffix(withCeilToTwoDecimals(totalSales))
            : '—'}
        </StatValue>
      </StatWrapper>
    </Box>
  );
}
