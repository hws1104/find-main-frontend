import { styled } from 'stitches.config';
import Box from './Box';

const Overlay = styled(Box, {
  position: 'absolute',
  zIndex: 2,
  height: '100%',
  top: 0,
  left: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  width: '100%',
});

export default Overlay;
