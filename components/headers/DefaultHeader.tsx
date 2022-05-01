import { useEffect } from 'react';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import ConnectWalletButton from './ConnectWalletButton';
import MobileHeaderOpenButton from './MobileHeaderOpenButton';
import MobileHeaderSearchButton from './MobileHeaderSearchButton';
import NavLinks from './NavLinks';

import { HeaderProps } from './types';

interface DefaultHeaderProps extends HeaderProps {
  isDark: boolean;
}

export default function DefaultHeader(props: DefaultHeaderProps): JSX.Element {
  const { isDark, isNavOpen, setNavOpen, searchOpen, setSearchOpen } = props;

  useEffect(() => {
    setNavOpen(false);
  }, [searchOpen, setNavOpen]);

  return (
    <Flex css={{ alignItems: 'center' }}>
      <NavLinks isDark={isDark} />
      <Flex>
        {!isNavOpen && (
          <Box css={{ display: 'none', '@bp2': { display: 'flex' } }}>
            <ConnectWalletButton isDark={isDark} />
          </Box>
        )}

        <MobileHeaderSearchButton isOpen={searchOpen} setOpen={setSearchOpen} />

        {!searchOpen && (
          <MobileHeaderOpenButton isOpen={isNavOpen} setOpen={setNavOpen} />
        )}
      </Flex>
    </Flex>
  );
}
