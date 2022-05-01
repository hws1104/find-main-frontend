import { CSS } from 'stitches.config';
import { ReactNode } from 'react';
import NextLink from 'next/link';

import Link from 'components/base/Link';
import Button from 'components/base/Button';

import { ListArtworkPath } from './mint/types';

interface TransactionSuccessLinkProps {
  href?: string | ListArtworkPath;
  isLoading?: boolean;
  children: ReactNode;
  variant?: 'outline';
  css?: CSS;
}

export default function TransactionSuccessLink({
  href,
  isLoading = false,
  children,
  variant,
  css,
}: TransactionSuccessLinkProps): JSX.Element {
  if (href) {
    return (
      <NextLink href={href} passHref>
        <Link
          css={{
            display: 'block',
            pointerEvents: isLoading ? 'none' : 'auto',
            textDecoration: 'none',
          }}
        >
          <Button
            color="black"
            size="large"
            shape="regular"
            appearance={variant}
            disabled={isLoading}
            css={{ width: '100%', ...(css as any) }}
          >
            {children}
          </Button>
        </Link>
      </NextLink>
    );
  }

  return null;
}
