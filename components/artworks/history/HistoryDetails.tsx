import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';

const HistoryDetails = styled(Flex, {
  flex: 1,
  order: 2,
  '@bp0': {
    order: 1,
    flexWrap: 'wrap',
    marginRight: '$6',
  },
});

export default HistoryDetails;
