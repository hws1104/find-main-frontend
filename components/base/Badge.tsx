import { styled } from 'stitches.config';
import Box from './Box';

const Badge = styled(Box, {
  display: 'block',
  borderRadius: '$round',
  paddingX: '$4',
  paddingY: '$3',
  fontWeight: 600,
  variants: {
    color: {
      gray: {
        backgroundColor: '$black5',
        color: '$black40',
      },
    },
  },
});

export default Badge;
