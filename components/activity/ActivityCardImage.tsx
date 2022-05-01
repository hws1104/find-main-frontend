import NextLink from 'next/link';

import Box from 'components/base/Box';
import Link from 'components/base/Link';
import ActivityCardMedia from './ActivityCardMedia';

import { BasicArtwork } from 'types/Artwork';
import { buildArtworkPath } from 'utils/artwork/artwork';
import { buildArtworkCardAssetUrl, buildPosterUrl } from 'utils/assets';

interface ActivityCardImageProps {
  artwork: BasicArtwork;
}

export default function ActivityCardImage(
  props: ActivityCardImageProps
): JSX.Element {
  const { artwork } = props;

  const assetUrl = buildArtworkCardAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const creator = artwork.creator;

  const artworkPath = buildArtworkPath({ artwork, user: creator });

  return (
    <Box
      css={{
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <NextLink href={artworkPath} passHref>
        <Link
          css={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <ActivityCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
        </Link>
      </NextLink>
    </Box>
  );
}
