import { styled } from 'stitches.config';

const Mono = styled('div', {
  fontFamily: '$mono',
  fontWeight: 400,
  letterSpacing: '$mono',
  variants: {
    tight: {
      true: {
        letterSpacing: 0,
      },
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    size: {
      0: { fontSize: '$0' },
      1: { fontSize: '$1' },
      2: { fontSize: '$2' },
      3: { fontSize: '$3' },
      4: { fontSize: '$4' },
      5: { fontSize: '$5' },
      6: { fontSize: '$6' },
    },
  },
});

export default Mono;
