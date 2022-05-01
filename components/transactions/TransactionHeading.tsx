import { styled } from 'stitches.config';
import Text from 'components/base/Text';

const TransactionHeading = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$4',
  letterSpacing: -0.8,
  lineHeight: 1.1,
  margin: 0,
  marginBottom: '$6',
  variants: {
    size: {
      small: {
        fontSize: '$3',
        letterSpacing: -0.2,
        marginBottom: '$5',
      },
    },
  },
});

export default TransactionHeading;
