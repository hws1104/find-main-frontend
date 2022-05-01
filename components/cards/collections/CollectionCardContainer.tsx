import { styled } from 'stitches.config';
import CollectionCardBgImageContainer from './CollectionCardBgImageContainer';
import Image from 'components/base/Image';

const CollectionCardContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 490,
  overflow: 'hidden',
  borderRadius: '$2',
  boxShadow: '$1',
  transition: 'transform $2 $ease, box-shadow $2 $ease',
  cursor: 'pointer',
  transform: 'translate3d(0, 0, 0)',
  willChange: 'transform',
  position: 'relative',
  padding: '$7',
  color: 'currentColor',
  textDecoration: 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  variants: {
    enableZoomOnHover: {
      true: {
        '@hover': {
          '&:hover': {
            transform: 'translate3d(0, -4px, 0)',
            boxShadow: '$2',
            [`& ${CollectionCardBgImageContainer} ${Image}`]: {
              transform: 'scale(1.1)',
            },
          },
        },
      },
    },
  },
});

export default CollectionCardContainer;
