import { styled } from 'stitches.config';
import Box from 'components/base/Box';

const Overlay = styled(Box, {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  visibility: 'hidden',
  transform: 'unset',
  pointerEvents: 'none',
  backfaceVisibility: 'unset',
});

export default Overlay;
