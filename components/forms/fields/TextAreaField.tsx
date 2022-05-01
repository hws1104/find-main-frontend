import { styled } from 'stitches.config';
import { useField } from 'formik';
import { InputHTMLAttributes } from 'react';
import { ComponentProps } from '@stitches/react';
import AutoExpand, { TextareaProps } from 'react-expanding-textarea';

import Grid from 'components/base/Grid';
import LabelWrapper from './LabelWrapper';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import InputV2 from 'components/base/InputV2';

import { notEmptyOrNil } from 'utils/helpers';
import { PartialPick } from 'types/utils';

type StitchesTextAreaProps = ComponentProps<typeof InputV2>;
type TextArea = InputHTMLAttributes<HTMLTextAreaElement>;

type RequiredTextArea = Pick<TextArea, 'name'>;
type OptionalTextArea = PartialPick<
  TextArea,
  'placeholder' | 'required' | 'type' | 'disabled' | 'maxLength'
>;

interface TextAreaFieldProps extends RequiredTextArea, OptionalTextArea {
  rows: TextareaProps['rows'];
  css?: StitchesTextAreaProps['css'];
  label?: string;
  tip?: string;
}

const AutoExpandInput = styled(AutoExpand, InputV2);

export default function TextAreaField<T extends string>(
  props: TextAreaFieldProps
): JSX.Element {
  const {
    name,
    placeholder,
    maxLength,
    label,
    required = false,
    disabled = false,
    css,
    rows,
    tip,
  } = props;

  const [field, meta] = useField<T>(name);

  const isInvalid = notEmptyOrNil(meta.error);

  const isOptional = !required;

  const currentLength = meta.value?.toString().length || 0;

  return (
    <Box>
      <LabelWrapper name={name} label={label} isOptional={isOptional} />
      <AutoExpandInput
        isInvalid={isInvalid}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        css={{ resize: 'none', ...css }}
        {...field}
      />

      {(maxLength || isInvalid) && (
        <Grid css={{ paddingTop: '$3', gridTemplateColumns: '3fr 1fr' }}>
          {tip && !isInvalid && (
            <Text size={0} css={{ color: '$black60', gridColumn: 1 }}>
              {tip}
            </Text>
          )}
          {isInvalid && (
            <Text size={0} weight={600} css={{ color: '$red100' }}>
              {meta.error}
            </Text>
          )}
          {maxLength && (
            <Text
              size={0}
              css={{ color: '$black60', justifySelf: 'end', gridColumn: 2 }}
            >
              {`${currentLength}/${maxLength}`}
            </Text>
          )}
        </Grid>
      )}
    </Box>
  );
}
