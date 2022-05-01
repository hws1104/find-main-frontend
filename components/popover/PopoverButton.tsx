import { VariantProps } from '@stitches/react';

import Flex from 'components/base/Flex';

import { styled } from 'stitches.config';

export type PopoverVariants = VariantProps<typeof PopoverButton>;

export const PopoverButton = styled(Flex, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  cursor: 'pointer',
  backgroundColor: '$white100',
  transition: '$1 $ease',

  variants: {
    size: {
      small: {
        width: 40,
        height: 40,
      },
      regular: {
        width: 40,
        height: 40,
        '@bp0': {
          width: 56,
          height: 56,
        },
      },
    },
    appearance: {
      minimal: {
        '@hover': {
          '&:hover': {
            backgroundColor: '$black5',
          },
        },
      },
      normal: {
        boxShadow: '$0',
        '@hover': {
          '&:hover': {
            background: '$white100',
            boxShadow: '$1',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            boxShadow: '$0',
            transform: 'translateY(0px)',
          },
        },
      },
    },
  },
});

export default PopoverButton;
