import { styled } from 'stitches.config';

const CircleText = styled('div', {
  color: '$white100',
  fontSize: '$2',
  width: 28,
  height: 28,
  lineHeight: '28px',
  borderRadius: '50%',
  textAlign: 'center',
  marginX: '$2',
  background: '$blue100',
  '@bp1': {
    width: 52,
    height: 52,
    fontSize: '$4',
    lineHeight: '53px',
    marginLeft: 0,
    marginRight: '$5',
  },
});

export default CircleText;
