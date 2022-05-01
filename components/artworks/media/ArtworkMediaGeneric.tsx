import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Body from 'components/base/Body';
import { ProductMedia } from 'components/media/Media';

import { BasicArtwork } from 'types/Artwork';

interface ArtworkMediaGenericProps {
  artwork: BasicArtwork;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ArtworkMediaGeneric(props: ArtworkMediaGenericProps) {
  const { artwork } = props;

  return (
    <ArtworkMediaContainer>
      <ArtworkContainer>
        <ProductMedia artwork={artwork} controls />
      </ArtworkContainer>
    </ArtworkMediaContainer>
  );
}

const FixedHeightMedia = styled(Flex, {
  position: 'relative',
  minHeight: '66vh',
  '@bp0': {
    height: 'calc(100vh - 16px)',
  },
  '@media (min-width: 1680px)': {
    height: '90vh',
  },
  '@media (min-width: 1800px)': {
    height: '80vh',
  },
});

export const ArtworkMediaContainer = styled(FixedHeightMedia, {
  backgroundColor: '#F2F2F2',
});

const ArtworkContainer = styled(Body, {
  display: 'flex',
  flex: 1,
  paddingTop: 110,
  paddingBottom: '$10',

  '@bp2': {
    paddingTop: 134,
  },
  '.fullscreen': {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  '.fullscreen-enabled': {
    padding: '$6',
    background: '$white100',
  },
});
