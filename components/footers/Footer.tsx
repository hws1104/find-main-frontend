/* eslint-disable react/jsx-max-depth */
import { CSS } from 'stitches.config';
import { includes } from 'ramda';
import { ReactNode } from 'react';
import NextLink from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Body from 'components/base/Body';
import Link from 'components/base/Link';
import { FooterLogoLink } from 'components/links/LogoLink';
import MaximalFooter from './MaximalFooter';

import { PageType } from 'types/page';

interface SiteLink {
  children: ReactNode;
  href: string;
  external?: boolean;
}

const socialLinks: SiteLink[] = [
  {
    children: 'Instagram',
    href: 'https://www.instagram.com/withfoundation/',
    external: true,
  },
  { children: 'Twitter', href: 'https://twitter.com/withfnd', external: true },
  { children: 'Blog', href: '/blog' },
];

const otherLinks: SiteLink[] = [
  {
    children: 'About',
    href: '/about',
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
    children: 'Terms of Service',
    href: '/terms',
  },
  {
    children: 'Privacy',
    href: '/privacy',
  },
  {
    children: 'Help',
    href: 'https://help.foundation.app/',
    external: true,
  },
];

interface FooterProps {
  type?: string;
  footerStyle?: CSS;
}

export default function Footer(props: FooterProps): JSX.Element {
  const { type, footerStyle } = props;

  const shouldHideFooter = includes(type, [PageType.auth, PageType.minimal]);

  const maximalFooter = includes(type, [PageType.maximal]);

  if (shouldHideFooter) {
    return null;
  }

  if (maximalFooter) {
    return <MaximalFooter />;
  }

  return (
    <Box css={{ paddingY: '$8', ...(footerStyle as any) }}>
      <Body>
        <Grid
          css={{
            gap: '$6',
            gridTemplateColumns: 'repeat(6, 1fr)',
            alignItems: 'flex-start',
            '@bp1': { display: 'flex', alignItems: 'center' },
          }}
        >
          <Box css={{ gridColumn: '1/7' }}>
            <Flex>
              <FooterLogoLink />
            </Flex>
          </Box>
          <FooterLinkList
            css={{ gridColumn: '1/3', '@bp1': { display: 'flex' } }}
          >
            {socialLinks.map((link, key) => (
              <FooterLink {...link} key={key} />
            ))}
          </FooterLinkList>
          <FooterLinkList
            css={{
              gridColumn: '3/7',
              '@bp1': { display: 'flex', marginLeft: 'auto' },
            }}
          >
            {otherLinks.map((link, key) => (
              <FooterLink {...link} key={key} />
            ))}
          </FooterLinkList>
        </Grid>
      </Body>
    </Box>
  );
}

interface FooterLinkListProps {
  css?: CSS;
  children: ReactNode;
}

function FooterLinkList(props: FooterLinkListProps): JSX.Element {
  const { children, css } = props;
  return <Grid css={{ gap: 5, ...(css as any) }}>{children}</Grid>;
}

function FooterLink(props: SiteLink): JSX.Element {
  const { external, children, href } = props;

  const linkStyles: CSS = {
    display: 'block',
    fontSize: '$0',
    color: '$black60',
    fontWeight: 600,
    textDecoration: 'none',
    marginRight: '$2',
    transition: 'color $1 $ease',
    '&:last-of-type': {
      marginRight: 0,
    },
    '@hover': {
      '&:hover': {
        color: '$black100',
      },
    },
    '@bp1': { marginRight: '$4' },
  };

  if (external) {
    return (
      <Link
        className="footer-link"
        css={linkStyles as any}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </Link>
    );
  }

  return (
    <NextLink href={href} passHref>
      <Link className="footer-link" css={linkStyles as any}>
        {children}
      </Link>
    </NextLink>
  );
}
