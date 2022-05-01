import Box from 'components/base/Box';
import { styled } from 'stitches.config';

const TransactionSection = styled(Box, {
  paddingX: '$6',
  '@bp1': {
    paddingX: '$9',
  },
});

export default TransactionSection;
