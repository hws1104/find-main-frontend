import { styled } from 'stitches.config';
import Box from 'components/base/Box';

const BackgroundGradient = styled(Box, {
  position: 'relative',
  '&:after': {
    content: '',
    position: 'absolute',
    width: '100vw',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -2,
    transform: 'scaleX(1.5)',
  },

  variants: {
    color: {
      green: {
        '&:after': {
          background:
            'linear-gradient(180deg, #BDFF00 0%, rgba(189, 255, 0, 0) 100%)',
        },
      },
      yellow: {
        '&:after': {
          height: '140%',
          background:
            'linear-gradient(180deg, #FAFF00 0%, rgba(250, 255, 0, 0) 100%)',
        },
      },
      gray: {
        '&:after': {
          background:
            'linear-gradient(180deg, #CBCBCB 0%, rgba(203, 203, 203, 0) 100%)',
        },
      },
    },
  },
});

export default BackgroundGradient;
