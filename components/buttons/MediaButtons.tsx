import { CSS } from 'stitches.config';
import { useState, useEffect } from 'react';

import hasFullscreenSupport from 'utils/hasFullscreenSupport';

import Muted from 'assets/icons/muted.svg';
import Unmuted from 'assets/icons/unmuted.svg';
import Fullscreen from 'assets/icons/fullscreen.svg';
import ExitFullscreen from 'assets/icons/exit-fullscreen.svg';

import Box from 'components/base/Box';

export interface AudioToggleProps {
  onClick: () => void;
  isMuted: boolean;
}

export function AudioToggle(props: AudioToggleProps): JSX.Element {
  const { onClick, isMuted } = props;
  return (
    <Box
      as="button"
      css={{
        appearance: 'none',
        background: 'unset',
        border: 'none',
        borderRadius: '$round',
        height: 36,
        width: 36,
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        color: '$black60',
        transition:
          'color $1 $ease, background-color $1 $ease, border-radius $1 $ease',
        textAlign: 'center',
        '@hover': {
          '&:hover': {
            color: '$black100',
            backgroundColor: '$black10',
            borderRadius: '$round',
          },
        },
      }}
      onClick={onClick}
    >
      <Box css={{ display: 'flex' }}>
        {isMuted ? (
          <Muted
            style={{
              width: 18,
              height: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        ) : (
          <Unmuted
            style={{
              width: 19,
              height: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export interface FullscreenToggleProps {
  css?: CSS;
  onClick: () => void;
  isFullscreen: boolean;
}

export function FullscreenToggle(props: FullscreenToggleProps): JSX.Element {
  const { css, onClick, isFullscreen } = props;
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    const supportsFullscreen = hasFullscreenSupport();

    setFullscreenSupported(supportsFullscreen);
  }, []);

  if (!fullscreenSupported) {
    return null;
  }

  return (
    <Box
      as="button"
      css={{
        appearance: 'none',
        background: 'unset',
        border: 'none',
        borderRadius: '$round',
        height: 36,
        width: 36,
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        color: '$black60',
        transition:
          'color $1 $ease, background-color $1 $ease, border-radius $1 $ease',
        textAlign: 'center',
        '@hover': {
          '&:hover': {
            color: '$black100',
            backgroundColor: '$black10',
            borderRadius: '$round',
          },
        },
        ...(css as any),
      }}
      onClick={onClick}
    >
      <Box css={{ display: 'flex' }}>
        {isFullscreen ? (
          <ExitFullscreen
            style={{
              width: 16,
              height: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        ) : (
          <Fullscreen
            style={{
              width: 16,
              height: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
