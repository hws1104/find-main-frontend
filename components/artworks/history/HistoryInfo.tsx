import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';

const HistoryInfo = styled(Flex, {
  display: 'grid',
  flex: 1,
  gridGap: '$1',
  '@bp0': {
    display: 'flex',
    gridGap: 0,
  },
});

export default HistoryInfo;
