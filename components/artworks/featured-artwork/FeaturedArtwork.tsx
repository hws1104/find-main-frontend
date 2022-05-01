import NextLink from 'next/link';
import { useCallback } from 'react';

import Link from 'components/base/Link';
import FeaturedArtworkMedia from './FeaturedArtworkMedia';
import FeaturedArtworkPrice from './FeaturedArtworkPrice';
import FeaturedArtworkTitle from './FeaturedArtworkTitle';
import FeaturedArtworkButton from './FeaturedArtworkButton';
import FeaturedArtworkInfo from './FeaturedArtworkInfo';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { FeaturedArtworkEvent } from './types';

import { buildArtworkPath } from 'utils/artwork/artwork';
import { getMostRecentAuction } from 'utils/auctions/auctions';

import useArtworkByContractTokenId from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useSegmentEvent from 'hooks/use-segment-event';

interface FeaturedArtwork {
  artwork: ArtworkFragmentExtended;
}

export default function FeaturedArtwork(props: FeaturedArtwork): JSX.Element {
  const { artwork } = props;

  const { isError, isFetchedAfterMount } = useArtworkByContractTokenId(
    { tokenId: artwork.tokenId, contractSlug: artwork.collection.slug },
    { refetchInterval: 60 * 1000 }
  );

  const [sendSegmentEvent] = useSegmentEvent<FeaturedArtworkEvent>();

  const artworkPath = buildArtworkPath({ artwork, user: artwork.creator });

  // get auction data from the query vs. static data
  const auction = getMostRecentAuction(artwork);

  // when the data is state (on initial load) and we have no error
  // then this is the equivalent of our loading state
  const isLoading = !isFetchedAfterMount && !isError;

  const handleSegmentEvent = useCallback(
    (eventComponent: FeaturedArtworkEvent['component']) => {
      sendSegmentEvent({
        eventName: 'primary_featured_artwork_clicked',
        payload: {
          auctionId: auction.auctionId,
          contractAddress: artwork.contractAddress,
          tokenId: artwork.tokenId,
          component: eventComponent,
        },
      });
    },
    [auction, artwork, sendSegmentEvent]
  );

  return (
    <Grid
      css={{
        position: 'relative',
        minHeight: 'calc(80vh - 86px)',
        gridGap: 0,
        '@bp1': {
          alignItems: 'center',
          paddingTop: '$9',
          gridTemplateColumns: 'repeat(2,1fr)',
          gridGap: '$7',
        },
        '@bp2': {
          paddingTop: '$10',
          gridGap: '$8',
        },
        '@bp3': {
          gridGap: '$10',
        },
      }}
    >
      <NextLink href={artworkPath} passHref prefetch={false}>
        <Link
          css={{
            width: '100%',
            display: 'flex',
            '@bp1': { maxWidth: 640, marginLeft: 'auto' },
          }}
          onClick={() => handleSegmentEvent('artwork_asset')}
        >
          <FeaturedArtworkMedia artwork={artwork} />
        </Link>
      </NextLink>
      <Box
        css={{
          position: 'relative',
          '@bp2': {
            paddingBottom: '$6',
          },
        }}
      >
        <Grid
          css={{
            paddingTop: '$6',
            gridGap: '$6',
            color: '$black100',
            '@bp2': {
              gridGap: '$7',
            },
          }}
        >
          <FeaturedArtworkTitle
            artwork={artwork}
            artworkPath={artworkPath}
            handleSegmentEvent={handleSegmentEvent}
          />
          <FeaturedArtworkInfo
            collection={artwork.collection}
            user={artwork.creator}
            handleSegmentEvent={handleSegmentEvent}
          />
          <FeaturedArtworkPrice auction={auction} isLoading={isLoading} />
          <FeaturedArtworkButton
            handleSegmentEvent={handleSegmentEvent}
            artworkPath={artworkPath}
            isLoading={isLoading}
          />
        </Grid>
      </Box>
    </Grid>
  );
}
