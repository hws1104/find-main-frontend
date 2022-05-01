import { styled } from 'stitches.config';

const Text = styled('div', {
  variants: {
    size: {
      0: { fontSize: '$0' },
      1: { fontSize: '$1' },
      2: { fontSize: '$2' },
      3: { fontSize: '$3', letterSpacing: '-0.01em' },
      4: { fontSize: '$4', letterSpacing: '-0.02em' },
      5: { fontSize: '$5', letterSpacing: '-0.02em' },
      // TODO: try out these letter spacings + adjust if needed
      6: { fontSize: '$6', letterSpacing: '-0.02em' },
      7: { fontSize: '$7', letterSpacing: '-0.02em' },
      8: { fontSize: '$8', letterSpacing: '-0.025em' },
      9: { fontSize: '$9', letterSpacing: '-0.025em' },
      10: { fontSize: '$10', letterSpacing: '-0.03em' },
    },
    weight: {
      400: {
        fontWeight: '$normal',
      },
      body: {
        fontWeight: '$normal',
      },
      600: {
        fontWeight: '$semibold',
      },
      heading: {
        fontWeight: '$semibold',
      },
      semibold: {
        fontWeight: '$semibold',
      },
    },
    color: {
      rainbow: {
        background:
          'linear-gradient(110.78deg, #76E650 -1.13%, #F9D649 15.22%, #F08E35 32.09%, #EC5157 48.96%, #FF18BD 67.94%, #1A4BFF 85.34%, #62D8F9 99.57%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    },
  },
});

export default Text;
