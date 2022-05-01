import { ReactNode } from 'react';

import Button from 'components/base/Button';

interface DisabledButtonProps {
  children: ReactNode;
}

export default function DisabledButton(
  props: DisabledButtonProps
): JSX.Element {
  const { children } = props;
  return (
    <Button
      color="gray"
      size="large"
      shape="regular"
      css={{ width: '100%' }}
      disabled
    >
      {children}
    </Button>
  );
}
