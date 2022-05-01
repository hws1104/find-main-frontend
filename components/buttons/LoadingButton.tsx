import { ReactNode } from 'react';
import { CSS, keyframes } from 'stitches.config';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Image from 'components/base/Image';
import Button from 'components/base/Button';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

function SmallSpinner() {
  return (
    <Image
      src="/images/spinner-small.png"
      alt="Loading spinner"
      css={{
        animation: `${rotate} 800ms linear infinite`,
        animateFillMode: 'forwards',
      }}
    />
  );
}

interface LoadingButtonProps {
  css?: CSS;
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
}

function LoadingButton(props: LoadingButtonProps): JSX.Element {
  const {
    css,
    children,
    disabled = false,
    isLoading,
    isSmall = false,
    onClick,
    type = 'button',
  } = props;

  return (
    <Button
      color="black"
      disabled={disabled || isLoading}
      hoverable
      onClick={onClick}
      shape="regular"
      size={isSmall ? 'regular' : 'large'}
      type={type}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      css={{ display: 'inline-block', width: '100%', ...(css as any) }}
    >
      <Grid
        css={{
          gridTemplateColumns: '24px auto 24px',
          gridGap: '$4',
          alignItems: 'center',
        }}
      >
        {isLoading ? <SmallSpinner /> : <Box />}
        {children}
        <Box />
      </Grid>
    </Button>
  );
}

export default LoadingButton;
