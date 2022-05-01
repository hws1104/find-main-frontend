import { useCallback } from 'react';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

interface ConnectWalletButtonProps {
  isDark?: boolean;
  className?: string;
}

export default function ConnectWalletButton(
  props: ConnectWalletButtonProps
): JSX.Element {
  const { isDark, className } = props;

  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  return (
    <Box css={{ alignItems: 'center' }} className={className}>
      <Button
        shape="round"
        size="regular"
        color={isDark ? 'white' : 'black'}
        css={{
          fontSize: '$2',
          display: 'flex',
          alignItems: 'center',
          paddingX: '$6',
          minHeight: 46,
          maxHeight: 46,
          borderColor: isDark ? '$white100' : '$black100',
          '@bp1': {
            paddingX: '$7',
            minHeight: 54,
            maxHeight: 54,
          },
        }}
        onClick={openModal}
      >
        Connect
        <Box css={{ display: 'none', '@bp1': { display: 'inline' } }}>
          {'\u00A0'}Wallet
        </Box>
      </Button>
    </Box>
  );
}
