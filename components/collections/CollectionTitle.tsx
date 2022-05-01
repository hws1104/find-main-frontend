import Heading from 'components/base/Heading';
import { styled } from 'stitches.config';

const CollectionTitle = styled(Heading, {
  lineHeight: 1,
  color: '$white100',
  wordBreak: 'break-word',
  maxWidth: 720,
  '@bp2': {
    fontSize: '$8',
  },
  variants: {
    color: {
      dark: {
        color: '$black100',
      },
      light: {
        color: '$white100',
      },
    },
  },
});

export default CollectionTitle;
