import { css } from 'stitches.config';

import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Image from 'components/base/Image';
import { MediaVideo } from 'components/media/Media';
import Model from 'components/model-media/Model';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import ThreeDIcon from 'assets/icons/3d-icon.svg';

import {
  buildArtworkPageAssetUrl,
  buildPosterUrl,
  isModel,
  isVideo,
} from 'utils/assets';

interface FeaturedArtworkMediaProps {
  artwork: ArtworkFragmentExtended;
}

const modelStyles = css({
  width: '100%',
})();

export default function FeaturedArtworkMedia(
  props: FeaturedArtworkMediaProps
): JSX.Element {
  const { artwork } = props;

  const assetUrl = buildArtworkPageAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const isVideoUrl = isVideo(assetUrl);
  const isModelUrl = isModel(assetUrl);

  if (isVideoUrl) {
    return (
      <MediaVideo
        assetUrl={assetUrl}
        posterUrl={posterUrl}
        css={{
          maxHeight: '60vh',
          maxWidth: '100%',
          margin: 'auto',
          objectFit: 'contain',
        }}
      />
    );
  }

  if (isModelUrl) {
    return (
      <Box
        css={{
          display: 'flex',
          height: 400,
          width: '100%',
          boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
          pointerEvents: 'none',
          '@bp1': {
            height: 500,
          },
        }}
      >
        <Model src={assetUrl} className={modelStyles.className} disableAR />
        <Box
          css={{
            display: 'flex',
            position: 'absolute',
            top: 18,
            left: 18,
            zIndex: 2,
            opacity: 0.5,
            color: '$black100',
            '@bp1': {
              top: 25,
              left: 25,
            },
          }}
        >
          <Box css={{ width: 20 }}>
            <ThreeDIcon />
          </Box>
          <Heading size={0} css={{ marginLeft: '$1' }}>
            3D
          </Heading>
        </Box>
      </Box>
    );
  }

  return (
    <Image
      src={assetUrl}
      alt={artwork?.name}
      css={{
        maxHeight: '60vh',
        maxWidth: '100%',
        width: '100%',
        height: '100%',
        margin: 'auto',
        objectFit: 'contain',
      }}
    />
  );
}
