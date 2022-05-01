/* eslint-disable react/jsx-max-depth */
import { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { cond, T } from 'ramda';

import { SharedHeaderProps } from 'components/headers/types';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import LogoLink from 'components/links/LogoLink';
import HeaderContainer from 'components/headers/HeaderContainer';
import MobileHeader from 'components/headers/MobileHeader';
import SearchBar from 'components/search/SearchBar';
import InnerHeaderContainer from 'components/headers/InnerHeaderContainer';
import Overlay from 'components/headers/Overlay';
import LoadingHeader from 'components/headers/LoadingHeader';
import AuthHeader from 'components/headers/AuthHeader';
import DefaultHeader from 'components/headers/DefaultHeader';

interface HeaderComposedProps extends SharedHeaderProps {
  isLoading: boolean;
  isConnected: boolean;
  isApprovedCreator: boolean;
  activityCount: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function HeaderComposed(props: HeaderComposedProps) {
  const {
    color,
    absolute,
    mode,
    isDark,
    activityCount,
    isLoading,
    isConnected,
  } = props;

  const [isNavOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [measureRef, { height: viewportHeight }] = useMeasure();

  const logoColor = isNavOpen ? '#000' : color;

  useEffect(() => {
    setNavOpen(false);
  }, [searchOpen]);

  const defaultProps = {
    isNavOpen,
    setNavOpen,
    searchOpen,
    setSearchOpen,
  };

  return (
    <Box css={{ position: 'relative' }}>
      <Overlay ref={measureRef} />
      <MobileHeader
        viewportHeight={viewportHeight}
        isOpen={isNavOpen}
        isConnected={isConnected}
      />
      <HeaderContainer absolute={absolute}>
        <InnerHeaderContainer className="header-inner">
          {!searchOpen && (
            <Flex css={{ color: logoColor }}>
              <LogoLink color={logoColor} />
            </Flex>
          )}

          <SearchBar {...defaultProps} pageColorMode={mode} />

          {cond<boolean, JSX.Element>([
            // when the auth state is loading, render the loading header
            [() => isLoading, () => <LoadingHeader />],
            // when the auth state is connected, render the auth header
            [
              (isConnected) => isConnected,
              () => (
                <AuthHeader
                  {...defaultProps}
                  isDark={isDark}
                  activityCount={activityCount}
                />
              ),
            ],
            // otherwise fall-through and render the default un-auth'ed header
            [T, () => <DefaultHeader {...defaultProps} isDark={isDark} />],
          ])(isConnected)}
        </InnerHeaderContainer>
      </HeaderContainer>
    </Box>
  );
}
