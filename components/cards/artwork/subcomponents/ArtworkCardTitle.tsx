import Heading from 'components/base/Heading';
import { styled } from 'stitches.config';

const ArtworkCardTitle = styled(Heading, {
  fontSize: '$3',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default ArtworkCardTitle;
