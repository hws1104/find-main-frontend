import { styled } from 'stitches.config';

import Box from 'components/base/Box';

const Background = styled(Box, {
  position: 'absolute',
  zIndex: -2,
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
});

export default Background;
