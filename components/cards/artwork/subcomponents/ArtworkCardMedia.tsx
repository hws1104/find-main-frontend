import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useIsInViewport from 'use-is-in-viewport';

import { isImage, isModel, isVideo } from 'utils/assets';
import { notEmptyOrNil } from 'utils/helpers';

import CardVideo from 'components/cards/shared/CardVideo';
import AspectRatio from 'components/base/AspectRatio';
import Box from 'components/base/Box';
import Image from 'components/base/Image';

import useAssetReady from 'hooks/use-asset-ready';
import MediaLoadingSpinner from 'components/media/MediaLoadingSpinner';

const MotionImage = motion(Image);
const MotionCardVideo = motion(CardVideo);

interface ArtworkCardMediaProps {
  assetUrl: string;
  posterUrl?: string;
}

export default function ArtworkCardMedia(
  props: ArtworkCardMediaProps
): JSX.Element {
  const { assetUrl, posterUrl } = props;
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false);

  const hasAssetUrl = notEmptyOrNil(assetUrl);

  const [isInViewport, targetRef] = useIsInViewport();

  useEffect(() => {
    if (isInViewport) {
      setHasBeenInViewport(true);
    }
  }, [isInViewport]);

  if (hasAssetUrl) {
    return (
      <Box ref={targetRef}>
        <AspectRatio
          ratio={1 / 1}
          css={{
            background: '$black5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AnimatePresence exitBeforeEnter>
            <RenderArtworkCardMedia
              url={assetUrl}
              posterUrl={posterUrl}
              hasBeenInViewport={hasBeenInViewport}
            />
          </AnimatePresence>
        </AspectRatio>
      </Box>
    );
  }

  return <AspectRatio ratio={1 / 1} css={{ backgroundColor: '$black5' }} />;
}

interface RenderArtworkCardMediaProps {
  url: string;
  hasBeenInViewport: boolean;
  posterUrl?: string;
}

function RenderArtworkCardMedia(
  props: RenderArtworkCardMediaProps
): JSX.Element {
  const { url, posterUrl, hasBeenInViewport } = props;

  const isUrlVideo = isVideo(url);
  const isUrlModel = isModel(url);
  const isUrlImage = isImage(url);

  const { isLoading, isError } = useAssetReady(url, isUrlImage);
  const [imageLoaded, setImageLoaded] = useState(false);

  const animationProps = {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 },
  };

  if (!hasBeenInViewport && (isUrlVideo || isUrlModel)) {
    return (
      <motion.div {...animationProps} style={{ backgroundColor: '#F2F2F2' }} />
    );
  }

  if (isUrlVideo) {
    return (
      <MotionCardVideo {...animationProps} posterUrl={posterUrl} url={url} />
    );
  }

  if (isUrlModel) {
    return (
      <Box css={{ position: 'relative', height: '100%', width: '100%' }}>
        <MotionImage
          {...animationProps}
          loading="lazy"
          src={posterUrl}
          css={{
            display: 'block',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    );
  }
  const isImageLoading = isLoading || isError;

  if (isImageLoading) {
    return (
      <MediaLoadingSpinner
        isLoading={isImageLoading}
        size={32}
        color="$black100"
      />
    );
  }

  return (
    <>
      <MediaLoadingSpinner
        isLoading={!imageLoaded}
        size={32}
        color="$black100"
      />

      <MotionImage
        {...animationProps}
        loading="lazy"
        src={url}
        onLoad={() => setImageLoaded(true)}
        css={{
          display: 'block',
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </>
  );
}
