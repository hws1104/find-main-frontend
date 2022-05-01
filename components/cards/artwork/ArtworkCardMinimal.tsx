import Box from 'components/base/Box';
import Card from 'components/base/Card';
import { ArtworkCardSkeletonMinimal } from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from './subcomponents/ArtworkCardTitle';
import ArtworkCardTitleContainer from './subcomponents/ArtworkCardTitleContainer';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkCardOptimizing from './subcomponents/ArtworkCardOptimizing';

import {
  buildArtworkCardAssetUrl,
  buildPosterUrl,
  hasVideoAssetProcessingStatus,
} from 'utils/assets';

import { BasicArtwork } from 'types/Artwork';

interface ArtworkCardMinimalProps<T> {
  artwork: T;
  creator: BasicArtwork['creator'];
}

export default function ArtworkCardMinimal<T extends BasicArtwork>(
  props: ArtworkCardMinimalProps<T>
): JSX.Element {
  const { artwork, creator } = props;

  if (!artwork) {
    return <ArtworkCardSkeletonMinimal />;
  }

  const assetUrl = buildArtworkCardAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const isVideoAssetPending = hasVideoAssetProcessingStatus(artwork);

  return (
    <Card
      css={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box css={{ position: 'relative' }}>
        <ArtworkCardOptimizing
          isVisible={isVideoAssetPending}
          css={{ top: '$6', left: '$6' }}
        />
        <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
      </Box>
      <ArtworkCardTitleContainer>
        <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
        <UserTagRaw user={creator} css={{ marginTop: 'auto' }} />
      </ArtworkCardTitleContainer>
    </Card>
  );
}
