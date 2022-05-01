import { ReactNode } from 'react';

import Button from 'components/base/Button';
import Link from 'components/links/Link';

interface ArtworkCardMetaButtonProps {
  href: string;
  children: ReactNode;
  disabled?: boolean;
}

export default function ArtworkCardMetaButton(
  props: ArtworkCardMetaButtonProps
): JSX.Element {
  const { href, children, disabled } = props;

  return (
    <Link href={href}>
      <a
        style={{
          display: 'block',
          textDecoration: 'none',
          width: '100%',
          pointerEvents: disabled ? 'none' : 'all',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Button
          disabled={disabled}
          color="white"
          shape="regular"
          css={{
            height: 49,
            width: '100%',
            display: 'block',
            paddingX: '$5',
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </Button>
      </a>
    </Link>
  );
}
