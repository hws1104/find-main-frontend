import { ReactNode } from 'react';

import ModalContent from 'components/modals/common/ModalContent';

interface ModalContentVirtualizedProps {
  children: ReactNode;
}

export default function ModalContentVirtualized(
  props: ModalContentVirtualizedProps
): JSX.Element {
  const { children } = props;

  return (
    <ModalContent
      css={{
        maxWidth: 760,
        minHeight: 640,
        maxHeight: 640,
        padding: 0,
        overflow: 'auto',
        justifyContent: 'flex-start',
        backgroundColor: '$white100',
        position: 'relative',
      }}
    >
      {children}
    </ModalContent>
  );
}
