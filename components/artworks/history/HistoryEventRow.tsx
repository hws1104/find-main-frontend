import { CSS } from 'stitches.config';
import Flex from 'components/base/Flex';
import { ReactNode } from 'react';

interface HistoryEventRowProps {
  children: ReactNode;
  css?: CSS;
}

export default function HistoryEventRow(
  props: HistoryEventRowProps
): JSX.Element {
  const { children, css } = props;

  return (
    <Flex
      css={{
        paddingX: '$5',
        paddingY: '$4',
        borderRadius: '$2',
        alignItems: 'flex-start',
        backgroundColor: '$white100',
        position: 'relative',
        '@bp0': {
          alignItems: 'center',
        },
        '&::before': {
          content: '',
          boxShadow: '$0',
          borderRadius: '$2',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(css as any),
      }}
    >
      {children}
    </Flex>
  );
}
