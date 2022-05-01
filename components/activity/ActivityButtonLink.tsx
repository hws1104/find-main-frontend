import Link from 'next/link';
import { ReactNode } from 'react';

import Button from 'components/base/Button';

export interface ActivityButtonLinkProps {
  href: string;
  children: ReactNode;
  color: 'white' | 'black';
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ActivityButtonLink(props: ActivityButtonLinkProps) {
  const { href, color, children } = props;
  return (
    <Link href={href}>
      <a style={{ display: 'block', textDecoration: 'none' }}>
        <Button
          color={color}
          shape={{ '@initial': 'regular', '@bp2': 'regular' }}
          size={{ '@initial': 'regular', '@bp2': 'large' }}
          css={{
            width: '100%',
            borderRadius: '$2',
            '@bp2': {
              borderRadius: '$3',
            },
          }}
          hoverable
        >
          {children}
        </Button>
      </a>
    </Link>
  );
}
