import { useField } from 'formik';

import Box from 'components/base/Box';
import Input from 'components/base/Input';
import ErrorField from 'components/forms/fields/ErrorField';

import { getErrorStyles, hasError } from 'utils/styles';

interface NumberFieldProps {
  name: string;
  autoFocus?: boolean;
  placeholder: string;
}

export default function NumberField(props: NumberFieldProps): JSX.Element {
  const { name, autoFocus } = props;

  const [field, meta] = useField(name);

  const errorVisible = hasError(meta, false);

  return (
    <Box
      css={{
        position: 'relative',
        fontFamily: '$mono',
        fontSize: '$5',
      }}
    >
      <Input
        {...field}
        {...props}
        type="number"
        css={{
          width: '100%',
          border: 'solid 4px transparent',
          borderRadius: '$2',
          minHeight: 70,
          padding: 0,
          paddingX: '$4',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          outline: 'none',
          transition: 'border $1 $ease',
          appearance: 'none',

          '&:focus': {
            borderColor: '$black100',
          },
          '&::placeholder': {
            color: '$black20',
          },
          '&::-webkit-outer-spin-button': {
            appearance: 'none',
          },
          '&::-webkit-inner-spin-button': {
            appearance: 'none',
          },
          ...getErrorStyles(errorVisible),
        }}
        step="1"
        autoFocus={autoFocus}
        onWheel={(ev) => ev.currentTarget.blur()}
      />
      <ErrorField meta={meta} />
    </Box>
  );
}
