/* eslint-disable max-lines */
import { CSS } from 'stitches.config';
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import MediaLoadingSpinner from 'components/media/MediaLoadingSpinner';
import { AudioToggle, FullscreenToggle } from 'components/buttons/MediaButtons';
import AspectRatio from 'components/base/AspectRatio';
import Image from 'components/base/Image';
import Box from 'components/base/Box';

import {
  buildArtworkPageAssetUrl,
  buildPosterUrl,
  isVideo,
} from 'utils/assets';
import hasFullscreenSupport from 'utils/hasFullscreenSupport';

import { BasicArtwork } from 'types/Artwork';

interface ProductMediaProps {
  ratio?: number;
  artwork: BasicArtwork;
  controls?: boolean;
}

export const ProductMedia = memo<ProductMediaProps>((props) => {
  const media = <MediaOfAnyType {...props} />;

  if (props.ratio) {
    const ratio = props.ratio || 1 / 1;
    return (
      <AspectRatio
        ratio={ratio}
        css={{
          background: '$black5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {media}
      </AspectRatio>
    );
  } else {
    return media;
  }
});

ProductMedia.displayName = 'ProductMedia';

interface MediaOfAnyTypeProps {
  artwork: BasicArtwork;
  controls?: boolean;
}

function MediaOfAnyType(props: MediaOfAnyTypeProps) {
  const { artwork, controls } = props;

  const assetUrl = buildArtworkPageAssetUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);

  const isAssetUrlVideo = isVideo(assetUrl);

  if (isAssetUrlVideo) {
    return (
      <MediaVideo
        assetUrl={assetUrl}
        posterUrl={posterUrl}
        controls={controls}
      />
    );
  }

  return <MediaImage imageUrl={assetUrl} controls={controls} />;
}

interface MediaImageProps {
  imageUrl: string;
  controls?: boolean;
}

export function MediaImage(props: MediaImageProps): JSX.Element {
  const { imageUrl, controls } = props;
  const [hasImageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // onLoad doesnt fire if the image is cached this checks for the complete attribute which is when the image is displayed
    if (imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [imgRef]);

  const fullscreenHandle = useFullScreenHandle();

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  return (
    <>
      <FullScreen handle={fullscreenHandle}>
        <MediaLoadingSpinner isLoading={!hasImageLoaded} size={32} />
        <Image
          alt=""
          ref={imgRef}
          src={imageUrl}
          css={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: fullscreenHandle.active ? 'default' : 'zoom-in',
          }}
          onLoad={() => {
            setImageLoaded(true);
          }}
          onClick={() => {
            if (
              !fullscreenHandle.active &&
              controls &&
              hasFullscreenSupport()
            ) {
              return fullscreenHandle.enter();
            }
          }}
        />

        {fullscreenHandle.active && (
          <Box
            css={{
              position: 'absolute',
              bottom: '$3',
              right: '$3',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FullscreenToggle
              onClick={handleFullscreen}
              isFullscreen={fullscreenHandle.active}
            />
          </Box>
        )}
      </FullScreen>
      {controls && (
        <Box
          css={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            paddingRight: '$5',
            paddingBottom: '$5',
          }}
        >
          <FullscreenToggle
            onClick={handleFullscreen}
            isFullscreen={fullscreenHandle.active}
          />
        </Box>
      )}
    </>
  );
}

interface MediaVideoProps {
  assetUrl: string;
  posterUrl?: string;
  className?: string;
  controls?: boolean;
  css?: CSS;
}

export function MediaVideo(props: MediaVideoProps): JSX.Element {
  const { assetUrl, posterUrl, controls, css } = props;

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fullscreenHandle = useFullScreenHandle();

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoObj = videoRef.current;

    const checkAudio = () => {
      const hasAudioChecks =
        Boolean(videoObj?.mozHasAudio) ||
        Boolean(videoObj?.webkitAudioDecodedByteCount) ||
        Boolean(videoObj?.audioTracks?.length);

      setHasAudio(hasAudioChecks);
    };

    const disableLoading = () => {
      setIsLoading(false);
    };

    videoObj.addEventListener('loadeddata', checkAudio);
    // Have to use timeupdate as sometimes 'play' event is missed due to timings, this fires mutliple times so will get it at least once
    if (isLoading) {
      videoObj.addEventListener('timeupdate', disableLoading);
    } else {
      videoObj.removeEventListener('timeupdate', disableLoading);
    }

    return () => {
      videoObj.removeEventListener('loadeddata', checkAudio);
      videoObj.removeEventListener('timeupdate', disableLoading);
    };
  }, [videoRef, isLoading]);

  const handleMute = () => {
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleFullscreen = () => {
    if (fullscreenHandle.active) {
      return fullscreenHandle.exit();
    }
    return fullscreenHandle.enter();
  };

  return (
    <Box
      css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        ...(css as any),
      }}
    >
      <FullScreen handle={fullscreenHandle}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            transition: 'filter 0.3s ease-in-out',
            cursor:
              fullscreenHandle.active || !controls ? 'default' : 'zoom-in',
            filter: isLoading ? 'blur(10px)' : '',
          }}
          src={assetUrl}
          poster={posterUrl}
          loop
          autoPlay
          muted
          playsInline
          onClick={() => {
            if (
              !fullscreenHandle.active &&
              controls &&
              hasFullscreenSupport()
            ) {
              return fullscreenHandle.enter();
            }
          }}
        />
        <MediaLoadingSpinner isLoading={isLoading} size={32} />
        {fullscreenHandle.active && (
          <Box
            css={{
              position: 'absolute',
              bottom: '$4',
              right: '$4',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {hasAudio && <AudioToggle isMuted={isMuted} onClick={handleMute} />}
            <FullscreenToggle
              onClick={handleFullscreen}
              isFullscreen={fullscreenHandle.active}
            />
          </Box>
        )}
      </FullScreen>
      {controls && (
        <>
          <Box
            css={{
              position: 'absolute',
              bottom: '$4',
              right: '$4',
            }}
          >
            {hasAudio && <AudioToggle isMuted={isMuted} onClick={handleMute} />}
            <FullscreenToggle
              css={{ marginLeft: '$2' }}
              onClick={handleFullscreen}
              isFullscreen={fullscreenHandle.active}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
