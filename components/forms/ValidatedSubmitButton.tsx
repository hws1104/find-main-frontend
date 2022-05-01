import { useField } from 'formik';
import { ReactNode } from 'react';

import Button from 'components/base/Button';
import DisabledButton from 'components/forms/transactions/DisabledButton';

interface ValidatedSubmitButtonProps {
  name: string;
  children: ReactNode;
}

export default function ValidatedSubmitButton(
  props: ValidatedSubmitButtonProps
): JSX.Element {
  const { name, children } = props;

  const [, meta] = useField(name);

  if (meta.error) {
    return <DisabledButton>{meta.error}</DisabledButton>;
  }

  return (
    <Button
      color="black"
      shape="regular"
      size="large"
      css={{ width: '100%' }}
      type="submit"
    >
      {children}
    </Button>
  );
}
