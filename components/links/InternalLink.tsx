import { CSS } from 'stitches.config';
import { ReactNode } from 'react';
import NextLink from 'next/link';

import Text from 'components/base/Text';
import Link from 'components/base/Link';

interface InternalLinkProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  css?: CSS;
  target?: string;
}

export default function InternalLink(props: InternalLinkProps): JSX.Element {
  const { href, children, css, onClick } = props;

  if (onClick) {
    return (
      <Text
        weight={600}
        css={{
          color: '$black60',
          transition: 'color $1 $ease',
          cursor: 'pointer',
          '@hover': {
            '&:hover': {
              color: '$black100',
            },
          },
          ...(css as any),
        }}
        onClick={onClick}
      >
        {children}
      </Text>
    );
  }

  return (
    <NextLink href={href} passHref prefetch={false}>
      <Link css={{ textDecoration: 'none' }}>
        <Text
          weight={600}
          css={{
            color: '$black60',
            transition: 'color $1 $ease',
            cursor: 'pointer',
            '@hover': {
              '&:hover': {
                color: '$black100',
              },
            },
            ...(css as any),
          }}
        >
          {children}
        </Text>
      </Link>
    </NextLink>
  );
}
