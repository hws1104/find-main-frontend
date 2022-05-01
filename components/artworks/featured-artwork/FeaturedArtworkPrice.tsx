/* eslint-disable max-lines */
import { css } from 'stitches.config';

import ArtworkAuctionCountdown from '../auction/ArtworkAuctionCountdown';
import UserTagV3 from 'components/users/UserTagV3';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import GraySquare from 'components/base/GraySquare';
import ETHinUSD from 'components/ETHinUSD';

import { isAuctionEnded, isAuctionNotYetListed } from 'utils/auctions/auctions';
import { isTransferredOwnerMostRecent } from 'utils/artwork/artwork';
import { parseDateToUnix } from 'utils/dates/dates';
import { formatETHWithSuffix } from 'utils/formatters';

import { AuctionFragment } from 'graphql/hasura/hasura-fragments.generated';
import {
  ArtworkInfoBlock,
  ArtworkInfoContainer,
  ArtworkInfoHeading,
} from '../ArtworkInfo';

interface FeaturedArtworkPriceProps {
  auction: AuctionFragment;
  isLoading: boolean;
}

const priceStyles = css({
  whiteSpace: 'pre',
  textAlign: 'left',
  paddingBottom: '$1',
  '@bp0': {
    paddingRight: '$7',
  },
  '@bp3': {
    marginBottom: 0,
  },
})();

export default function FeaturedArtworkPrice(
  props: FeaturedArtworkPriceProps
): JSX.Element {
  const { auction, isLoading } = props;

  const isEnded = isAuctionEnded(parseDateToUnix(auction?.endsAt));
  const isNotYetListed = isAuctionNotYetListed(auction);

  // TODO: pass in the new artwork history here (and simplify the logic)
  const hasDifferentOwner = isTransferredOwnerMostRecent([]);

  if (isLoading) {
    return (
      <Flex
        css={{
          flexDirection: 'column',
          '@bp3': {
            flexDirection: 'row',
            paddingBottom: 0,
          },
        }}
      >
        <SkeletonLoadingBlock className={priceStyles} />
        <SkeletonLoadingBlock />
      </Flex>
    );
  }

  if (hasDifferentOwner) {
    return (
      <ArtworkInfoContainer>
        <ArtworkInfoBlock>
          <ArtworkInfoHeading spacing="large">Owned by</ArtworkInfoHeading>
          <Flex css={{ marginY: 'auto' }}>
            <UserTagV3 user={auction.highestBidderUser} />
          </Flex>
        </ArtworkInfoBlock>
      </ArtworkInfoContainer>
    );
  }

  if (isNotYetListed) {
    return null;
  }

  if (isEnded) {
    return (
      <ArtworkInfoContainer>
        <Price
          label="Sold for"
          amountInETH={auction.highestBidAmount}
          className={priceStyles}
        />
        <ArtworkInfoBlock>
          <ArtworkInfoHeading spacing="large">Owned by</ArtworkInfoHeading>
          <Flex css={{ marginY: 'auto' }}>
            <UserTagV3 user={auction.highestBidderUser} />
          </Flex>
        </ArtworkInfoBlock>
      </ArtworkInfoContainer>
    );
  }

  if (!auction?.highestBidder) {
    return (
      <Price label="Reserve price" amountInETH={auction.reservePriceInETH} />
    );
  }

  return (
    <ArtworkInfoContainer>
      <Price
        label="Current bid"
        amountInETH={auction.highestBidAmount}
        className={priceStyles}
      />
      <ArtworkInfoBlock>
        <ArtworkAuctionCountdown endDate={parseDateToUnix(auction?.endsAt)} />
      </ArtworkInfoBlock>
    </ArtworkInfoContainer>
  );
}

interface SkeletonLoadingBlockProps {
  className?: string;
}

function SkeletonLoadingBlock(props: SkeletonLoadingBlockProps): JSX.Element {
  const { className } = props;
  return (
    <Box className={className}>
      <GraySquare
        css={{
          marginBottom: '$2',
          height: 18,
          width: 80,
          '@bp3': { height: 20 },
        }}
      />
      <GraySquare
        css={{
          marginBottom: '$2',
          height: 35,
          width: 150,
          '@bp3': { height: 44 },
        }}
      />
      <GraySquare
        css={{
          height: 18,
          width: 50,
          '@bp3': { height: 20 },
        }}
      />
    </Box>
  );
}

interface PriceProps {
  label: string;
  amountInETH: number | string;
  className?: string;
}

function Price(props: PriceProps): JSX.Element {
  const { label, amountInETH, className } = props;
  return (
    <ArtworkInfoBlock className={className}>
      <ArtworkInfoHeading spacing="regular">{label}</ArtworkInfoHeading>
      <Text
        weight={600}
        css={{
          fontSize: '$3',
          marginBottom: '$2',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          '@bp3': {
            fontSize: '$4',
          },
        }}
      >
        {formatETHWithSuffix(Number(amountInETH))}
      </Text>
      <Text size={1} weight={600} css={{ color: '$black60' }}>
        <ETHinUSD amount={amountInETH} />
      </Text>
    </ArtworkInfoBlock>
  );
}
