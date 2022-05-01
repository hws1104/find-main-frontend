import { ReactNode } from 'react';
import { CSS } from 'stitches.config';

import Box from 'components/base/Box';

interface UserTagContainerProps {
  children: ReactNode;
  css?: CSS;
}

export default function UserTagContainer(
  props: UserTagContainerProps
): JSX.Element {
  const { children, css } = props;
  return (
    <Box
      css={{
        background: '$white100',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        ...(css as any),
      }}
    >
      {children}
    </Box>
  );
}
