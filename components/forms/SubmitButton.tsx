import { CSS } from 'stitches.config';
import { ReactNode } from 'react';
import { useFormikContext } from 'formik';
import LoadingButton from 'components/buttons/LoadingButton';
import Button from 'components/base/Button';

interface SubmitButtonProps {
  css?: CSS;
  children: ReactNode;
  submittingText?: string;
  disableIfInvalid?: boolean;
  isLoading?: boolean;
}

export default function SubmitButton(props: SubmitButtonProps): JSX.Element {
  const {
    css,
    children,
    submittingText,
    disableIfInvalid = false,
    isLoading = false,
  } = props;

  const { isSubmitting, isValid, isInitialValid } = useFormikContext();

  const disabled =
    isLoading ||
    isSubmitting ||
    (disableIfInvalid && !isValid && !isInitialValid);

  const loading = isLoading || isSubmitting;

  if (loading) {
    return (
      <LoadingButton css={{ width: '100%' }}>
        {submittingText ? submittingText : children ?? 'Submit'}
      </LoadingButton>
    );
  }

  return (
    <Button
      color="black"
      disabled={disabled}
      hoverable
      shape="regular"
      size="large"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      css={{ width: '100%', ...(css as any) }}
      type="submit"
    >
      {children ?? 'Submit'}
    </Button>
  );
}
