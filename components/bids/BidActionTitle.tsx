import Heading from 'components/base/Heading';

import { styled } from 'stitches.config';

const BidActionTitle = styled(Heading, {
  fontSize: '$body',
  '@bp1': {
    fontSize: '$2',
  },
  '@bp3': {
    fontSize: '$3',
  },
  variants: {
    alignment: {
      right: {
        marginLeft: '$3',
        '@bp1': {
          marginLeft: '$4',
        },
      },
      left: {
        marginRight: '$3',
        '@bp1': {
          marginRight: '$4',
        },
      },
    },
  },
});

export default BidActionTitle;
