import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';

const InnerHeaderContainer = styled(Flex, {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$6',
  position: 'relative',
  '@bp2': {
    marginBottom: 0,
  },
});

export default InnerHeaderContainer;
