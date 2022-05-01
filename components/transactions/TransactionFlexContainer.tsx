import Flex from 'components/base/Flex';
import { styled } from 'stitches.config';

const TransactionFlexContainer = styled(Flex, {
  justifyContent: 'center',
  '@bp1': {
    justifyContent: 'flex-start',
  },
});

export default TransactionFlexContainer;
