import { CSS } from 'stitches.config';
import { ReactNode } from 'react';

import Paragraph from 'components/base/Paragraph';

interface ModalCopyProps {
  children: ReactNode;
  css: CSS;
}

export default function ModalCopy({
  children,
  css,
}: ModalCopyProps): JSX.Element {
  return (
    <Paragraph
      css={{
        textAlign: 'center',
        maxWidth: 240,
        marginX: 'auto',
        ...(css as any),
      }}
    >
      {children}
    </Paragraph>
  );
}
