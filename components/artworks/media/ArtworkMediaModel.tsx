/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { css, styled } from 'stitches.config';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import Model from 'components/model-media/Model';
import Box from 'components/base/Box';
import Body from 'components/base/Body';
import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';

import { ArtworkMediaContainer } from './ArtworkMediaGeneric';
import { FullscreenToggle } from 'components/buttons/MediaButtons';

import ThreeDIcon from 'assets/icons/3d-icon.svg';

const modelStyles = css({
  width: '100%',
})();

interface ArtworkMediaModelProps {
  assetUrl: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ArtworkMediaModel(props: ArtworkMediaModelProps) {
  const { assetUrl } = props;
  const fullscreenHandle = useFullScreenHandle();

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  return (
    <ArtworkMediaContainer>
      <ModelContainer>
        <Flex css={{ width: '100%', height: '100%' }}>
          <ArtworkModel active={fullscreenHandle.active}>
            <FullScreen handle={fullscreenHandle}>
              <Model src={assetUrl} className={modelStyles} />
              <ThreeDLabel />
              <FullscreenToggle
                onClick={handleFullscreen}
                isFullscreen={fullscreenHandle.active}
                css={{ position: 'absolute', bottom: 20, right: 24 }}
              />
            </FullScreen>
          </ArtworkModel>
        </Flex>
      </ModelContainer>
    </ArtworkMediaContainer>
  );
}

const ModelContainer = styled(Body, {
  position: 'relative',

  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  paddingX: '$6',
  paddingTop: 110,
  paddingBottom: '$6',

  '@bp2': {
    paddingTop: 134,
    paddingBottom: '$8',
  },
  '.fullscreen': {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  '.fullscreen-enabled': {
    background: '$white100',
  },
});

const ArtworkModel = styled(Flex, {
  display: 'flex',
  width: '100%',
  boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)',
  borderRadius: '$3',
  position: 'relative',
  overflow: 'hidden',
  '.fullscreen': {
    display: 'flex',
    width: '100%',
    backgroundColor: 'transparent',
  },
  variants: {
    active: {
      true: {
        '.fullscreen': {
          backgroundColor: '$black100',
        },
      },
    },
  },
});

const ThreeDWrapper = styled(Flex, {
  position: 'absolute',
  top: 18,
  left: 18,
  zIndex: 2,
  opacity: 0.5,
  '@bp1': {
    top: 25,
    left: 25,
  },
});

function ThreeDLabel() {
  return (
    <ThreeDWrapper>
      <Box css={{ width: 20 }}>
        <ThreeDIcon />
      </Box>
      <Heading size={0} css={{ marginLeft: '$1' }}>
        3D
      </Heading>
    </ThreeDWrapper>
  );
}
