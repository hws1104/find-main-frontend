import { useState, useEffect } from 'react';
import useIsInViewport from 'use-is-in-viewport';
import { AnimatePresence, motion } from 'framer-motion';

import { isModel, isVideo } from 'utils/assets';
import { notEmptyOrNil } from 'utils/helpers';

import Image from 'components/base/Image';
import Box from 'components/base/Box';
import AspectRatio from 'components/base/AspectRatio';

import CardVideo from 'components/cards/shared/CardVideo';
import ThreeDIcon from 'assets/icons/3d-icon.svg';
import ArtworkCardPill from 'components/cards/artwork/subcomponents/ArtworkCardPill';

const MotionImage = motion(Image);
const MotionCardVideo = motion(CardVideo);

interface ActivityCardMediaProps {
  assetUrl: string;
  posterUrl?: string;
}

export default function ActivityCardMedia(
  props: ActivityCardMediaProps
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

  return <AspectRatio ratio={1 / 1} css={{ background: '$black5' }} />;
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
      <Box
        css={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        <ArtworkCardPill.Wrapper
          css={{
            position: 'absolute',
            left: '$5',
            top: '$5',
            '@media(max-width: 800px)': {
              display: 'none',
            },
          }}
        >
          <ThreeDIcon height={16} width={16} />
          <ArtworkCardPill.Label>3D</ArtworkCardPill.Label>
        </ArtworkCardPill.Wrapper>
        <MotionImage
          {...animationProps}
          loading="lazy"
          src={posterUrl}
          style={{
            display: 'block',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    );
  }

  return (
    <MotionImage
      {...animationProps}
      loading="lazy"
      src={url}
      style={{
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
