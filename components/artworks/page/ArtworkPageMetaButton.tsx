import { ReactNode } from 'react';
import NextLink from 'next/link';
import Button from 'components/base/Button';

interface ArtworkPageMetaButtonProps {
  children: ReactNode;
  href: string;
  disabled?: boolean;
}

export default function ArtworkPageMetaButton(
  props: ArtworkPageMetaButtonProps
): JSX.Element {
  const { href, children, disabled } = props;

  return (
    <NextLink href={href} passHref>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <Button
          disabled={disabled}
          color="black"
          shape="regular"
          size="large"
          hoverable
          css={{
            marginTop: '$7',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {children}
        </Button>
      </a>
    </NextLink>
  );
}
