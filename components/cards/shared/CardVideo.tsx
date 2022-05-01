import { CSS, styled } from 'stitches.config';
import { forwardRef } from 'react';

const StyledVideo = styled('video', {
  display: 'block',
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  position: 'absolute',
});

interface CardVideoProps {
  url: string;
  posterUrl: string;
  css?: CSS;
}

const CardVideo = forwardRef<HTMLVideoElement, CardVideoProps>((props, ref) => {
  const { url, posterUrl, css } = props;

  return (
    <StyledVideo
      ref={ref}
      css={css as any}
      loop
      src={url}
      poster={posterUrl}
      autoPlay
      muted
      playsInline
    />
  );
});

export default CardVideo;
