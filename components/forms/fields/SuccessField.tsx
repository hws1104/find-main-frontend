import { ReactNode } from 'react';

import HintText from 'components/forms/fields/HintText';

interface SuccessFieldProps {
  children: ReactNode;
}

export default function SuccessField(props: SuccessFieldProps): JSX.Element {
  const { children } = props;

  return <HintText intent="success">{children}</HintText>;
}
