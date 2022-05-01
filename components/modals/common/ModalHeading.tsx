import { ReactNode } from 'react';
import { CSS } from 'stitches.config';

import Heading from 'components/base/Heading';

interface ModalHeadingProps {
  children: ReactNode;
  css?: CSS;
}

export default function ModalHeading({
  children,
  css,
}: ModalHeadingProps): JSX.Element {
  return (
    <Heading
      size={3}
      css={{
        textAlign: 'center',
        marginBottom: '$7',
        maxWidth: 220,
        marginX: 'auto',
        ...(css as any),
      }}
    >
      {children}
    </Heading>
  );
}
