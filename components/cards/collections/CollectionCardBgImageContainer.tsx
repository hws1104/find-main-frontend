import { styled, keyframes } from 'stitches.config';

const shimmer = keyframes({
  '0%': {
    backgroundPosition: '0 0',
  },
  '10%': {
    backgroundPosition: '20% 20%',
  },
  '30%': {
    backgroundPosition: '0 0',
  },
});

const CollectionCardBgImageContainer = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  zIndex: -1,
  transition: 'transform $2 $ease',
  variants: {
    metallic: {
      true: {
        background: '$white100',
        '&:after': {
          content: '',
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          zIndex: 2,
          backgroundImage: `linear-gradient(135deg, #E6E4E4 0%, rgba(208, 207, 207, 0.869767) 7.29%, rgba(208, 207, 207, 0.869767) 7.3%, rgba(212, 211, 211, 0.711702) 9.38%, rgba(216, 214, 214, 0.6) 22.4%, rgba(234, 233, 233, 0.60875) 29.69%, rgba(215, 215, 215, 0.62) 39.06%, rgba(255, 255, 255, 0.46) 53.13%, rgba(230, 230, 230, 0.482667) 61.46%, rgba(255, 255, 255, 0.63) 76.56%, rgba(217, 217, 217, 0.876667) 92.19%, rgba(217, 217, 217, 0.876667) 92.2%, #EAE6E6 100%);
          `,
        },
      },
    },
    shimmer: {
      true: {
        '&:after': {
          backgroundSize: '200% 200%',
          animation: `${shimmer} 9000ms 3s infinite ease`,
        },
      },
    },
  },
});

export default CollectionCardBgImageContainer;
