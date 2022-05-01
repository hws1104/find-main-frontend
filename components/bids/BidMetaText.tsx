import Paragraph from 'components/base/Paragraph';
import { styled } from 'stitches.config';

const BidMetaText = styled(Paragraph, {
  marginBottom: '$4',
  maxWidth: 280,
  fontSize: '$0',
  '@bp0': {
    fontSize: '$1',
  },
});

export default BidMetaText;
