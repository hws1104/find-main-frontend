import { ReactNode } from 'react';
import { VariantProps } from '@stitches/react';

import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { CSS, styled } from 'stitches.config';

type HintTextContainerVariants = VariantProps<typeof HintTextContainer>;

interface HintTextProps extends Required<HintTextContainerVariants> {
  children: ReactNode;
  css?: CSS;
}

export default function HintText(props: HintTextProps): JSX.Element {
  const { children, intent } = props;

  return (
    <HintTextContainer intent={intent}>
      <Text size={0} css={{ color: 'inherit' }}>
        {children}
      </Text>
    </HintTextContainer>
  );
}

const HintTextContainer = styled(Box, {
  borderRadius: 5,
  marginTop: 10,
  paddingX: 10,
  paddingY: 6,
  variants: {
    intent: {
      success: {
        backgroundColor: '$green10',
        color: '$green100',
      },
      error: {
        backgroundColor: '$red10',
        color: '$red100',
      },
    },
  },
});
