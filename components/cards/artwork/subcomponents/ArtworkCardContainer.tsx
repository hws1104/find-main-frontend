import Flex from 'components/base/Flex';

import { styled } from 'stitches.config';

const ArtworkCardContainer = styled(Flex, {
  backgroundColor: '$white100',
  display: 'flex',
  flex: 'auto',
  flexDirection: 'column',
  borderRadius: '$2',
  overflow: 'hidden',
  boxShadow: '$0',
  transition: '$1',
  textDecoration: 'none',
  color: '$black100',
  position: 'relative',
  willChange: 'transform',
  '@bp0': {
    minWidth: 340,
  },
  '@hover': {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '$1',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '$0',
    },
  },
  variants: {
    isHovered: {
      true: {
        transform: 'translateY(-4px)',
        boxShadow: '$1',
        '&:active': {
          transform: 'translateY(-4px)',
          boxShadow: '$1',
        },
      },
    },
  },
});

export default ArtworkCardContainer;
