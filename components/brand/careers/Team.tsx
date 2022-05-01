import { styled } from 'stitches.config';
import Text from 'components/base/Text';

const Team = styled(Text, {
  fontFamily: '$body',
  color: '$black60',
  fontWeight: 400,
  letterSpacing: 1.5,
  fontSize: '$2',
  textTransform: 'uppercase',
  marginBottom: '$4',
});

export default Team;
