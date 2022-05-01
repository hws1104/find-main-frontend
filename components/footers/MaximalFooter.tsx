/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { CSS } from 'stitches.config';
import { ReactNode } from 'react';
import NextLink from 'next/link';

import Box from 'components/base/Box';
import Body from 'components/base/Body';
import Flex from 'components/base/Flex';
import Divider from 'components/base/Divider';
import Text from 'components/base/Text';
import Button from 'components/base/Button';
import Link from 'components/base/Link';
import ExternalLink from 'components/links/ExternalLink';

import InstagramIcon from 'assets/icons/instagram-icon.svg';
import TwitterIcon from 'assets/icons/twitter-icon.svg';
import FNDLogo from 'assets/images/fnd-logo.svg';

interface SiteLink {
  children: ReactNode;
  href: string;
  external?: boolean;
  css?: CSS;
}

const otherLinks: SiteLink[] = [
  {
    children: 'About',
    href: '/about',
  },
  {
    children: 'Blog',
    href: '/blog',
  },
  {
    children: 'Press',
    href: '/press',
  },
  { children: 'Careers', href: '/careers' },
  {
    children: 'Community Guidelines',
    href: '/community-guidelines',
  },
  {
    children: 'Help',
    href: 'https://help.foundation.app/',
    external: true,
  },
];

const adminLinks: SiteLink[] = [
  {
    children: 'Terms of Service',
    href: '/terms',
  },
  {
    children: 'Privacy',
    href: '/privacy',
  },
];

export default function MaximalFooter(): JSX.Element {
  return (
    <Box
      as="footer"
      css={{
        backgroundColor: '$black100',
        color: '$black60',
        paddingY: '$5',
        zIndex: 1,
        '@bp1': {
          paddingY: '$8',
        },
      }}
    >
      <Body>
        <Flex
          css={{
            paddingBottom: '$5',
            flexDirection: 'column-reverse',
            justifyContent: 'space-between',
            '@bp1': {
              paddingBottom: '$9',
              flexDirection: 'row',
            },
          }}
        >
          <SubscribeModule />
          <Flex
            css={{
              flexDirection: 'column',
              '@bp1': {
                textAlign: 'right',
                alignItems: 'flex-end',
              },
            }}
          >
            {otherLinks.map((link, key) => (
              <FooterLink
                {...link}
                key={key}
                css={{ fontSize: '$3', lineHeight: 1.4 }}
              />
            ))}
          </Flex>
        </Flex>
        <Divider css={{ backgroundColor: '$black80' }} />
        <Flex
          css={{
            paddingTop: '$5',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '@bp1': {
              paddingTop: '$7',
              flexDirection: 'row',
            },
          }}
        >
          <Box>
            <Flex
              css={{
                flexDirection: 'column',
                marginBottom: '$6',
                '@bp1': {
                  flexDirection: 'row',
                  marginBottom: 'unset',
                },
              }}
            >
              <Box
                css={{
                  color: '$white100',
                  marginRight: '$6',
                  marginBottom: '$3',
                }}
              >
                <FNDLogo width={65} />
              </Box>
              {adminLinks.map((link, key) => (
                <FooterLink
                  {...link}
                  key={key}
                  css={{
                    paddingBottom: '$2',
                    '@bp1': {
                      paddingRight: '$6',
                      paddingBottom: 0,
                    },
                  }}
                />
              ))}
            </Flex>
          </Box>
          <Box>
            <Flex
              css={{
                marginLeft: 0,
                '@bp1': { marginLeft: '$6' },
              }}
            >
              <FooterLink
                href="https://www.instagram.com/withfoundation/"
                external
              >
                <InstagramIcon
                  width={24}
                  height={24}
                  style={{ marginRight: 16 }}
                />
              </FooterLink>
              <FooterLink href="https://twitter.com/withfnd" external>
                <TwitterIcon width={24} height={24} />
              </FooterLink>
            </Flex>
          </Box>
        </Flex>
      </Body>
    </Box>
  );
}

function SubscribeModule() {
  return (
    <Box>
      <Box
        css={{
          maxWidth: 290,
          display: 'none',
          '@bp1': { display: 'block' },
        }}
      >
        <Text
          css={{
            fontFamily: '$body',
            color: '$white100',
            fontWeight: 600,
            letterSpacing: -0.2,
            fontSize: '$3',
            marginBottom: '$2',
          }}
        >
          Newsletters
        </Text>
        <Text
          css={{
            fontFamily: '$body',
            color: '$black40',
            fontWeight: 600,
            fontSize: '$1',
            lineHeight: 1.375,
          }}
        >
          Stay up to date on new releases, interviews, events, and updates from
          Foundation’s community.
        </Text>
      </Box>
      <Button
        color="black"
        size="large"
        shape="regular"
        css={{
          border: '1px solid $black80',
          marginTop: '$7',
          '@hover': {
            '&:hover': {
              backgroundColor: '$blue100',
              borderColor: '$blue100',
            },
          },
        }}
      >
        <NextLink href="/newsletters" passHref>
          <Link
            style={{
              textDecoration: 'none',
              display: 'block',
              color: 'inherit',
            }}
          >
            Subscribe
          </Link>
        </NextLink>
      </Button>
    </Box>
  );
}

function FooterLink(props: SiteLink): JSX.Element {
  const { external, children, href, css } = props;

  if (external) {
    return (
      <ExternalLink
        css={{
          color: '$black50',
          '@hover': {
            '&:hover': {
              color: '$white100',
            },
          },
          ...(css as any),
        }}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </ExternalLink>
    );
  }
  return (
    <NextLink href={href} passHref>
      <Link
        css={{
          fontSize: '$0',
          color: '$black50',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color $2 $ease',
          '@hover': {
            '&:hover': {
              color: '$white100',
            },
          },
          ...(css as any),
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
}
