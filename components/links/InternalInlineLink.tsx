import { ComponentProps } from '@stitches/react';
import { ReactNode } from 'react';
import NextLink from 'next/link';
import Link from 'components/base/Link';

interface InternalInlineLinkProps {
  children: ReactNode;
  href?: string;
  target?: string;
  css?: StitchesLinkProps['css'];
}

export type StitchesLinkProps = ComponentProps<typeof Link>;

export default function InternalInlineLink(
  props: InternalInlineLinkProps
): JSX.Element {
  const { href, children, target, css } = props;

  return (
    <NextLink href={href} passHref>
      <Link
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        css={{ textDecoration: 'none', color: 'inherit', ...css }}
        target={target}
      >
        {children}
      </Link>
    </NextLink>
  );
}
