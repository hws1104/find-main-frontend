import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { useMeasure } from 'react-use';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Input from 'components/base/InputV2';
import Text from 'components/base/Text';
import { ValidationStates } from 'components/forms/FieldMeta';

import { notEmpty, truncateAddress } from 'utils/helpers';

interface WalletAddressFieldProps {
  name: string;
  placeholder: string;
}

export default function WalletAddressField(
  props: WalletAddressFieldProps
): JSX.Element {
  const [field, meta, helpers] = useField(props);

  const { value } = field;
  const { error } = meta;

  const isValid = !!(value.length === 42 && !meta.error);
  const hasError = !!(notEmpty(value) && error);

  const [charRef, { width: charWidth }] = useMeasure();
  const [boxRef, { width: fieldWidth }] = useMeasure();

  const [displayValue, setDisplayValue] = useState(value);

  const onBlur = () => helpers.setTouched(true);

  function handleKeyPress(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      helpers.setValue('');
    }
  }

  useEffect(() => {
    // this is ported over from the existing app
    // TODO: add comments regarding the logic
    const strLength = value?.length ?? 0;
    const maxChars = fieldWidth / charWidth;

    if (strLength >= maxChars) {
      const numberOfChars = Math.round((fieldWidth / charWidth - 5) / 2);

      const truncatedStr = truncateAddress({ address: value, numberOfChars });

      setDisplayValue(truncatedStr);
    } else {
      setDisplayValue(value);
    }
  }, [value, fieldWidth, charWidth]);

  return (
    <Box>
      <Flex
        css={{
          height: 0,
          opacity: 0,
          paddingLeft: '$5',
          paddingRight: '$9',
        }}
      >
        <Box ref={boxRef} css={{ width: '100%' }} />
        <Text
          ref={charRef}
          css={{ alignSelf: 'flex-start', fontFamily: '$mono', fontSize: '$0' }}
        >
          -
        </Text>
      </Flex>

      <Box css={{ position: 'relative' }}>
        <Input
          {...props}
          {...field}
          onKeyDown={handleKeyPress}
          onBlur={onBlur}
          value={displayValue}
          css={{ fontFamily: '$mono', fontSize: '$0' }}
        />

        <ValidationStates hasError={hasError} isValid={isValid} />
      </Box>
    </Box>
  );
}
