import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';

const TabBar = styled(Flex, {
  boxShadow: 'inset 0 -1px 0 0 #E6E6E6',
  marginBottom: '$5',
  position: 'relative',
  '@bp1': {
    marginBottom: '$3',
  },
  '@bp2': {
    marginBottom: '$4',
  },
  variants: {
    isScrollable: {
      true: {
        '@media (max-width: 600px)': {
          '&:after': {
            pointerEvents: 'none',
            content: '',
            position: 'absolute',
            width: 60,
            right: 0,
            height: '100%',
            background:
              'linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255))',
          },
        },
      },
    },
  },
});

export default TabBar;
