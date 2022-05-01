import { urlWithParams } from 'utils/urls';

import Box from './base/Box';

interface ArticleImageProps {
  src: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function ArticleImage(props: ArticleImageProps) {
  const { src } = props;

  const imageUrl = urlWithParams(src, {
    q: 70,
    w: 1440,
    fit: 'fill',
  });

  return (
    <Box css={{ maxWidth: 1000, marginX: 'auto' }}>
      <Box
        css={{
          marginY: '$8',
          marginX: -24,
          '@bp0': {
            marginY: '$9',
          },
          '@bp1': {
            marginY: '$10',
          },
          '@bp2': {
            marginX: 0,
          },
        }}
      >
        <img style={{ display: 'block', maxWidth: '100%' }} src={imageUrl} />
      </Box>
    </Box>
  );
}
