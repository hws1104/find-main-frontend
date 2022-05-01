import { ReactNode } from 'react';

import Text from 'components/base/Text';
import Grid from 'components/base/Grid';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import Flex from 'components/base/Flex';
import ArtworkCardMetaBlock from './meta/ArtworkCardMetaBlock';
import ArtworkCardMetaLabel from './meta/ArtworkCardMetaLabel';

import { styled } from 'stitches.config';

import useCountdown from 'hooks/use-countdown';

import {
  AlgoliaArtwork,
  AlgoliaArtworkAvailability,
  AlgoliaAuction,
  AlgoliaAuctionStatus,
} from 'types/Algolia';

import { formatETHWithSuffix } from 'utils/formatters';
import { parseDateToUnix } from 'utils/dates/dates';

interface ArtworkCardSearchPricesProps {
  auction: AlgoliaAuction;
  artwork: AlgoliaArtwork;
}

export default function ArtworkCardSearchPrices(
  props: ArtworkCardSearchPricesProps
): JSX.Element {
  const { auction, artwork } = props;

  const auctionStatus = auction?.status;
  const isAuctionCanceled = auctionStatus === AlgoliaAuctionStatus.CANCELED;

  const { endsAt } = auction;

  // if timestamp is UNIX, convert to milliseconds and to ISO string
  const timestamp =
    typeof endsAt === 'number' ? new Date(endsAt * 1000).toISOString() : endsAt;

  const { countdownParts, hasEnded } = useCountdown(parseDateToUnix(timestamp));

  if (!auctionStatus || isAuctionCanceled) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMeta label="Reserve price" value="—" />
      </ArtworkCardMetaContainer>
    );
  }

  if (
    artwork.availability !== AlgoliaArtworkAvailability.LIVE_AUCTION &&
    auction.status === AlgoliaAuctionStatus.OPEN
  ) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMeta
          label="Reserve price"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkCardMetaContainer>
    );
  }

  if (hasEnded || auction.status === AlgoliaAuctionStatus.FINALIZED) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMeta
          label="Sold for"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkCardMetaContainer>
    );
  }

  if (artwork.availability === AlgoliaArtworkAvailability.LIVE_AUCTION) {
    return (
      <ArtworkCardMetaContainer css={{ backgroundColor: '$black100' }}>
        <ArtworkCardMetaBlock css={{ flex: 1 }}>
          <ArtworkCardMetaLabel css={{ color: '$black50' }}>
            Current bid
          </ArtworkCardMetaLabel>
          <ArtworkCardMetaLabel color="white">
            {formatETHWithSuffix(auction?.currentPrice)}
          </ArtworkCardMetaLabel>
        </ArtworkCardMetaBlock>
        <ArtworkCardMetaBlock css={{ textAlign: 'right' }}>
          <ArtworkCardMetaLabel css={{ color: '$black50' }}>
            Ending in
          </ArtworkCardMetaLabel>
          <Flex css={{ justifyContent: 'flex-end' }}>
            {countdownParts.map(({ value, shortLabel }, key) => (
              <ArtworkCardMetaLabel
                key={key}
                color="white"
                css={{ marginLeft: '$2', minWidth: 32 }}
              >
                {value}
                {shortLabel}
              </ArtworkCardMetaLabel>
            ))}
          </Flex>
        </ArtworkCardMetaBlock>
      </ArtworkCardMetaContainer>
    );
  }

  if (auction.status === AlgoliaAuctionStatus.OPEN) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMeta
          label="Reserve price"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkCardMetaContainer>
    );
  }

  return null;
}

interface ArtworkCardMetaProps {
  label: string;
  value: ReactNode;
}

function ArtworkCardMeta(props: ArtworkCardMetaProps): JSX.Element {
  const { label, value } = props;
  return (
    <Grid css={{ gap: '$1' }}>
      <ArtworkPriceLabel>{label}</ArtworkPriceLabel>
      <ArtworkPriceValue>{value}</ArtworkPriceValue>
    </Grid>
  );
}

const ArtworkPriceValue = styled(Text, {
  fontSize: '$1',
  fontWeight: 600,
  fontFamily: '$body',
});

const ArtworkPriceLabel = styled(ArtworkPriceValue, {
  color: '$black50',
});
