/* eslint-disable react/jsx-max-depth */
import { useRef } from 'react';
import { useToggle, useClickAway } from 'react-use';
import { useRouter } from 'next/router';
import { FunctionComponent, SVGAttributes } from 'react';
import NextLink from 'next/link';

import NavLink from './NavLink';
import NavLinkWrapper from './NavLinkWrapper';
import Flex from 'components/base/Flex';
import InnerNavLink from './InnerNavLink';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Icon from 'components/Icon';

import TrendingIcon from 'assets/icons/trending-icon.svg';
import BrowseIcon from 'assets/icons/browse-icon.svg';
import ChevronRight from 'assets/icons/right-chevron.svg';
import CollectionsIcon from 'assets/icons/collections-icon.svg';

import useIsomorphicLayoutEffect from 'hooks/use-isomorphic-layout-effect';

interface NavLinksProps {
  isDark: boolean;
  isLoggedIn?: boolean;
}

interface NavLink {
  label: string;
  href?: string;
  icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  innerLinks?: NavLink[];
}

export default function NavLinks(props: NavLinksProps): JSX.Element {
  const { isDark, isLoggedIn = false } = props;

  const router = useRouter();
  const currentPath = router.pathname;
  const ref = useRef(null);

  const [isOpen, toggleNav] = useToggle(false);

  useClickAway(ref, () => {
    toggleNav(false);
  });

  const appendRef = useRef(null);

  const innerLinks = [
    { label: 'Collections', href: '/collections', icon: CollectionsIcon },
    {
      label: 'Trending',
      href: '/trending',
      icon: TrendingIcon,
    },
    {
      label: 'Browse',
      href: '/artworks',
      icon: BrowseIcon,
    },
  ];

  const authNavLinks = [
    {
      label: 'Explore',
      innerLinks,
    },
    { label: 'Feed', href: '/feed' },
  ];

  const noAuthNavLinks = [
    {
      label: 'Explore',
      innerLinks,
    },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  const navLinks = isLoggedIn ? authNavLinks : noAuthNavLinks;

  useIsomorphicLayoutEffect(() => {
    appendRef.current = document.getElementById('portal');
  }, []);

  return (
    <NavLinkWrapper ref={ref}>
      {navLinks.map((link: NavLink) => {
        if (link.innerLinks) {
          return (
            <Box
              key={link.label}
              onClick={toggleNav}
              css={{ position: 'relative' }}
            >
              <Box css={{ cursor: 'pointer', minWidth: 0 }}>
                <NavLink as="div" isDark={isDark} css={{ marginRight: '$7' }}>
                  {link.label}
                </NavLink>
              </Box>

              {isOpen && (
                <Flex
                  css={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    position: 'absolute',
                    marginTop: '$6',
                    borderRadius: '$2',
                    width: 300,
                    backgroundColor: '$white100',
                    boxShadow: '$1',
                    flexDirection: 'column',
                    padding: '$2',
                  }}
                >
                  {link.innerLinks.map((link) => (
                    <NextLink key={link.href} href={link.href} passHref>
                      <InnerNavLink isActive={currentPath === link.href}>
                        <Box
                          css={{
                            display: 'flex',
                          }}
                        >
                          <Box
                            css={{
                              marginRight: '$4',
                              verticalAlign: 'text-bottom',
                            }}
                          >
                            <Icon icon={link.icon} width={22} height={22} />
                          </Box>
                          <Text>{link.label}</Text>
                        </Box>
                        <ChevronRight />
                      </InnerNavLink>
                    </NextLink>
                  ))}
                </Flex>
              )}
            </Box>
          );
        } else {
          return (
            <NextLink key={link.href} href={link.href} passHref>
              <NavLink
                isActive={currentPath === link.href}
                isDark={isDark}
                css={{ marginRight: '$7' }}
              >
                {link.label}
              </NavLink>
            </NextLink>
          );
        }
      })}
    </NavLinkWrapper>
  );
}
