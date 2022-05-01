import HintText from 'components/forms/fields/HintText';

interface ErrorFieldProps {
  meta: any;
  forceError?: boolean;
}

export default function ErrorField(props: ErrorFieldProps): JSX.Element {
  const { meta, forceError } = props;

  if ((meta.error && meta.touched) || (meta.error && forceError)) {
    return <HintText intent="error">{meta.error}</HintText>;
  }

  return null;
}
