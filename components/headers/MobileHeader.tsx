import { useLockBodyScroll } from 'react-use';

import ConnectWalletWideButton from './ConnectWalletWideButton';

import NextLink from 'next/link';

import Link from 'components/base/Link';
import Box from 'components/base/Box';
import { styled } from 'stitches.config';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';

interface MobileHeaderProps {
  viewportHeight: number;
  isOpen: boolean;
  isConnected: boolean;
}

export default function MobileHeader(props: MobileHeaderProps): JSX.Element {
  const { viewportHeight, isOpen, isConnected } = props;

  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay style={{ height: viewportHeight }}>
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          flex: 1,
        }}
      >
        <Box>
          {mobileNavLinks.map((navLink) => (
            <NextLink href={navLink.href} key={navLink.href} passHref>
              <Link
                css={{
                  display:
                    navLink.isAuthRoute && !isConnected ? 'none' : 'block',
                  color: '$black100',
                  textDecoration: 'none',
                  fontSize: '$4',
                  letterSpacing: -1,
                  lineHeight: 1.2,
                  fontWeight: 600,
                  '@bpxs': {
                    fontSize: '$3',
                  },
                }}
              >
                {navLink.children}
              </Link>
            </NextLink>
          ))}
        </Box>
        <Grid css={{ gridGap: '$6' }}>
          {!isConnected && <ConnectWalletWideButton />}
          <Grid
            css={{
              gridTemplateColumns: '1fr 1fr',
              marginTop: 'auto',
              gridColumnGap: '$6',
              gridRowGap: '$2',
              paddingBottom: '$7',
            }}
          >
            {secondaryLinks.map((navLink) => (
              <NextLink href={navLink.href} key={navLink.href} passHref>
                <Link
                  css={{
                    textDecoration: 'none',
                    display: 'block',
                    color: '$black30',
                    fontSize: '$0',
                    fontWeight: 600,
                  }}
                >
                  {navLink.children}
                </Link>
              </NextLink>
            ))}
          </Grid>
        </Grid>
      </Flex>
    </Overlay>
  );
}

const Overlay = styled(Flex, {
  position: 'fixed',
  paddingTop: '$10',
  paddingX: '$6',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  zIndex: 999,
  background: '$white100',
  flexDirection: 'column',
  height: '100vh',
});

const mobileNavLinks = [
  {
    href: '/feed',
    children: 'Feed',
    isAuthRoute: true,
  },
  {
    href: '/blog',
    children: 'Blog',
  },
  {
    href: '/about',
    children: 'About',
  },
  { href: '/careers', children: 'Careers' },
  {
    href: 'https://help.foundation.app',
    children: 'Help',
  },
  {
    children: 'Twitter',
    href: 'https://twitter.com/withfnd',
  },
  {
    children: 'Instagram',
    href: 'https://www.instagram.com/withfoundation/',
    external: true,
  },
];

const secondaryLinks = [
  {
    children: 'Press',
    href: '/press',
  },
  {
    children: 'Community Guidelines',
    href: '/community-guidelines',
  },
  {
    children: 'Terms of Service',
    href: '/terms',
  },
  {
    children: 'Privacy',
    href: '/privacy',
  },
];
