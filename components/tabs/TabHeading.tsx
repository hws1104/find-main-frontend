import { styled } from 'stitches.config';

import Text from 'components/base/Text';

const TabHeading = styled(Text, {
  borderBottom: '1px solid rgba(0,0,0,0)',
  paddingBottom: '$5',
  borderWidth: 2,
  marginRight: '$6',
  transition: 'border-color $1 $ease',
  cursor: 'pointer',
  lineHeight: 1.2,
  '&:last-of-type': {
    marginRight: '$8',
  },
  variants: {
    isActive: {
      true: {
        borderColor: '$black100',
      },
    },
  },
});

export default TabHeading;
