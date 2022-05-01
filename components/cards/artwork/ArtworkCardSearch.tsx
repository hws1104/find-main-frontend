import { VideoAssetQuality } from 'types/Assets';
import { AlgoliaArtwork } from 'types/Algolia';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Link from 'components/links/Link';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitle from 'components/cards/artwork/subcomponents/ArtworkCardTitle';
import ArtworkCardSkeleton from 'components/cards/artwork/ArtworkCardSkeleton';
import ArtworkCardSearchPrices from 'components/cards/artwork/subcomponents/ArtworkCardSearchPrices';
import ArtworkCardCollection from './subcomponents/ArtworkCardCollection';
import CardContextProvider, {
  useCardContext,
} from 'components/cards/CardContext';
import ArtworkCardContainer from './subcomponents/ArtworkCardContainer';
import ArtworkCardHeader from './subcomponents/ArtworkCardHeader';
import ArtworkCardCreator from './subcomponents/ArtworkCardCreator';

import { buildArtworkPath } from 'utils/artwork/artwork';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';

export default function ArtworkCardWithContext(
  props: ArtworkCardSearchProps
): JSX.Element {
  return (
    <CardContextProvider>
      <ArtworkCardSearch {...props} />
    </CardContextProvider>
  );
}

interface ArtworkCardSearchProps {
  artwork: AlgoliaArtwork;
}

export function ArtworkCardSearch(props: ArtworkCardSearchProps): JSX.Element {
  const { artwork } = props;

  const { creator, auction } = artwork;

  const { isHovered } = useCardContext();

  if (!artwork) {
    return <ArtworkCardSkeleton />;
  }

  const artworkPath = buildArtworkPath({ user: creator, artwork });

  const assetUrl = buildArtworkAssetUrl(
    { h: 640, q: 80, quality: VideoAssetQuality.Preview },
    artwork
  );

  const posterUrl = buildPosterUrl(artwork);

  return (
    <ArtworkCardContainer isHovered={isHovered} className="artwork-card">
      <Link href={artworkPath} passHref>
        <StyledLink>{artwork.name}</StyledLink>
      </Link>
      <Flex
        css={{
          paddingX: '$4',
          paddingY: '$2',
          color: '$black60',
        }}
      >
        <ArtworkCardCreator artwork={artwork} />
      </Flex>
      <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
      <ArtworkCardHeader>
        {artwork?.collection && (
          <ArtworkCardCollection collection={artwork?.collection} />
        )}
        <ArtworkCardTitle>{artwork.name}</ArtworkCardTitle>
      </ArtworkCardHeader>
      <Flex css={{ flexDirection: 'column', borderTop: 'solid 1px $black5' }}>
        <ArtworkCardSearchPrices auction={auction} artwork={artwork} />
      </Flex>
    </ArtworkCardContainer>
  );
}

const StyledLink = styled('a', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  textIndent: '-9999rem',
});
