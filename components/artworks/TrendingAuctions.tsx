import { take } from 'ramda';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import CardGrid from 'components/CardGrid';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import Pulse from 'components/Pulse';

import {
  TrendingAuctions as ITrendingAuctions,
  useTrendingAuctions,
} from 'graphql/hasura/queries/trending-auctions.generated';
import { scoreTrendingArtwork } from 'queries/artworks';

import Artwork from 'types/Artwork';

import { parseDateToUnix } from 'utils/dates/dates';
import { notEmptyOrNil } from 'utils/helpers';

const TRENDING_AUCTION_COUNT = 8;

export default function TrendingAuctions(): JSX.Element {
  const { data: auctionData, isLoading } = useTrendingAuctions(
    { limit: 48 },
    { select: selectTrendingAuctions, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <Box>
        <FeaturedSectionHeading>Trending auctions</FeaturedSectionHeading>

        <CardGrid>
          {[...Array(TRENDING_AUCTION_COUNT)].map((_, key) => (
            <ArtworkCardSkeleton key={key} />
          ))}
        </CardGrid>
      </Box>
    );
  }

  const hasAuctionArtworks = notEmptyOrNil(auctionData);

  if (!hasAuctionArtworks) {
    return null;
  }

  const topEightAuctions = take(TRENDING_AUCTION_COUNT, auctionData);

  return (
    <Box>
      <FeaturedSectionHeading
        link={{
          href: '/artworks?refinementList%5Bavailability%5D%5B0%5D=LIVE_AUCTION',
          text: 'View all auctions',
        }}
      >
        <Flex css={{ alignItems: 'center' }}>
          <Box css={{ position: 'relative', top: 2 }}>
            <Pulse size={10} />
          </Box>
          <Text css={{ marginLeft: '$3' }}>Trending auctions</Text>
        </Flex>
      </FeaturedSectionHeading>
      <CardGrid>
        {topEightAuctions.map((artwork: Artwork) => (
          <ArtworkCard
            artwork={artwork}
            creator={artwork.creator}
            currentUser={null}
            key={artwork.id}
          />
        ))}
      </CardGrid>
    </Box>
  );
}

function selectTrendingAuctions(res: ITrendingAuctions) {
  const order = res.auctions.map((a) => ({
    tokenId: a.artwork.tokenId,
    bidVolumeInETH: a.bidVolumeInETH.aggregate.sum.bidAmount,
    numberOfBids: a.bidCount.aggregate.count,
    dateEnding: parseDateToUnix(a.endsAt),
  }));

  const auctionArtworks = res.auctions.map((auction) => auction.artwork);

  return auctionArtworks.sort((a, b) => {
    const artwork1 = order.find((o) => o.tokenId === a.tokenId);
    const artwork2 = order.find((o) => o.tokenId === b.tokenId);

    return scoreTrendingArtwork(artwork2) - scoreTrendingArtwork(artwork1);
  });
}
