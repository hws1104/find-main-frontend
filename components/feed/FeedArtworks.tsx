import { flatten } from 'ramda';

import useFollowedArtworkEvents, {
  FollowedArtworkEvent,
} from 'hooks/queries/hasura/use-followed-artwork-events';

import { ArtworkCard } from 'components/cards/artwork/ArtworkCard';
import ArtworkCardEvent from 'components/cards/artwork/subcomponents/ArtworkCardEvent';
import CardGrid from 'components/CardGrid';
import Box from 'components/base/Box';
import InfiniteScrollButton from './InfiniteScrollButton';
interface FeedArtworksProps {
  publicAddress?: string;
}

export default function FeedArtworks(props: FeedArtworksProps): JSX.Element {
  const { publicAddress } = props;

  // Get all events from the feed dataset
  const {
    data: followedArtworkEventsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useFollowedArtworkEvents({
    publicKey: publicAddress,
  });

  // Flatten response to a single array
  const followedArtworkEvents = flatten(followedArtworkEventsData?.pages ?? []);

  // Take only the most recent artwork event from the feed, discard the rest
  const mostRecentFollowedArtworkEvents = followedArtworkEvents.reduce<
    FollowedArtworkEvent[]
  >((acc, curr) => {
    if (
      acc.findIndex((event) => event?.artwork?.tokenId === curr.tokenId) > -1
    ) {
      return acc;
    }

    return [...acc, curr];
  }, []);

  return (
    <>
      <Box css={{ paddingTop: '$8', '@bp2': { paddingTop: '$9' } }}>
        <CardGrid
          css={{
            gridRowGap: '$8',
            '@bp0': {
              gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
            },
          }}
        >
          {mostRecentFollowedArtworkEvents.map((event) => (
            <Box key={event.artwork.id}>
              <ArtworkCardEvent event={event} />
              <ArtworkCard
                artwork={event.artwork}
                creator={event.artwork.creator}
                currentUser={null}
              />
            </Box>
          ))}
        </CardGrid>
      </Box>
      <InfiniteScrollButton
        handleNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </>
  );
}
