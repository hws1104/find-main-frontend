import { VariantProps } from '@stitches/react';

import { CSS, styled } from 'stitches.config';

import { notEmptyOrNil } from 'utils/helpers';

import Text from 'components/base/Text';
import Button from 'components/base/Button';

type ChicletButtonVariants = VariantProps<typeof ChicletButton>;

interface ChicletProps extends ChicletButtonVariants {
  onClick: () => void;
  label: string;
  count?: number | string;
  css?: CSS;
  disabled?: boolean;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Chiclet(props: ChicletProps) {
  const { label, count, isActive, disabled = false, css, onClick } = props;

  const hasCount = notEmptyOrNil(count);

  return (
    <ChicletButton
      onClick={onClick}
      isActive={isActive}
      // separate the styling variant from the native button disabled prop
      isDisabled={disabled}
      disabled={disabled}
      css={{ ...(css as any) }}
    >
      {label}
      {hasCount && <ChicletCount>{count}</ChicletCount>}
    </ChicletButton>
  );
}

const ChicletButton = styled(Button, {
  fontSize: '$2',
  fontWeight: 600,
  color: '$black60',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  height: 32,
  paddingX: '$3',
  borderRadius: '$2',
  transition: 'color $1 $ease, background-color $1 $ease',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
  variants: {
    isDisabled: {
      true: {
        pointerEvents: 'none',
        color: '$black40',
      },
    },
    isActive: {
      true: {
        backgroundColor: '$black10',
        color: '$black100',
      },
    },
  },
});

const ChicletCount = styled(Text, {
  color: 'currentColor',
  fontWeight: '$body',
  lineHeight: '16px',
  marginLeft: '$2',
  paddingLeft: '$2',
  borderLeft: 'solid 1px $black20',
});
