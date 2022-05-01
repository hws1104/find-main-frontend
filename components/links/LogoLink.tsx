import NextLink from 'next/link';

import Logo from 'components/Logo';
import Link from 'components/base/Link';

import { CSS } from 'stitches.config';

interface LogoLinkProps {
  color: string;
  css?: CSS;
}

export default function LogoLink(props: LogoLinkProps): JSX.Element {
  const { color, css } = props;

  return (
    <NextLink href="/" passHref>
      <Link css={{ display: 'block', color }}>
        <Logo
          css={{
            width: 82,
            '@bp0': {
              width: 98,
            },
            ...(css as any),
          }}
        />
      </Link>
    </NextLink>
  );
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function FooterLogoLink() {
  return (
    <LogoLink
      css={{
        width: 65,
        '@bp0': {
          width: 65,
        },
      }}
      color="$black10"
    />
  );
}
