import { ReactNode } from 'react';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import SpinnerStroked from 'components/SpinnerStroked';
import { CSS } from 'stitches.config';

interface AuthConnectButtonProps {
  onClick: () => void;
  isLoading: boolean;
  children: ReactNode;
  backgroundImage: string;
  css?: CSS;
}

export default function AuthConnectButton(
  props: AuthConnectButtonProps
): JSX.Element {
  const { onClick, isLoading, children, backgroundImage, css } = props;
  return (
    <Button
      size="large"
      shape="regular"
      hoverable
      onClick={onClick}
      css={{
        backgroundImage,
        width: '100%',
        pointerEvents: isLoading ? 'none' : 'all',
        color: '$white100',
        '@bp1': {
          fontSize: '$2',
          paddingX: '$6',
          paddingY: '$4',
          minHeight: 64,
        },
        ...(css as any),
      }}
    >
      {isLoading ? (
        <Flex
          css={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          Connecting… <SpinnerStroked size={24} />
        </Flex>
      ) : (
        <Flex
          css={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {children}
        </Flex>
      )}
    </Button>
  );
}
