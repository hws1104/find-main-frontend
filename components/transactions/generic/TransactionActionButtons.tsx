import NextLink from 'next/link';
import { ReactNode } from 'react';

import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Button, { ButtonVariants } from 'components/base/Button';

import { styled } from 'stitches.config';

type ActionButton = ButtonVariants & {
  label: string;
  href: string;
  variants?: ButtonVariants;
};

interface TransactionActionButtonsProps {
  buttons: [ActionButton, ActionButton];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionActionButtons(
  props: TransactionActionButtonsProps
) {
  const { buttons } = props;

  const [primaryButton, secondaryButton] = buttons;

  return (
    <ButtonGrid>
      <TransactionActionButton
        href={primaryButton.href}
        variants={primaryButton.variants}
        label={primaryButton.label}
      />

      <TransactionActionButton
        href={secondaryButton.href}
        label={secondaryButton.label}
        variants={{ color: 'white', ...secondaryButton.variants }}
      />
    </ButtonGrid>
  );
}

interface TransactionActionButtonsExternalProps {
  buttons: [ReactNode, ActionButton];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function TransactionActionButtonsExternal(
  props: TransactionActionButtonsExternalProps
) {
  const { buttons } = props;

  const [primaryButton, secondaryButton] = buttons;

  return (
    <ButtonGrid>
      {primaryButton}

      <TransactionActionButton
        href={secondaryButton.href}
        label={secondaryButton.label}
        variants={{ color: 'white', ...secondaryButton.variants }}
      />
    </ButtonGrid>
  );
}

export function TransactionActionButton(props: ActionButton) {
  const { href, variants, label } = props;
  return (
    <Box>
      <NextLink href={href} passHref>
        <Button
          as="a"
          hoverable
          size="large"
          shape="regular"
          color="black"
          css={{ width: '100%' }}
          {...variants}
        >
          {label}
        </Button>
      </NextLink>
    </Box>
  );
}

export const ButtonGrid = styled(Grid, {
  gridTemplateColumns: '1fr 1fr',
  gap: '$4',
  width: '100%',
});
