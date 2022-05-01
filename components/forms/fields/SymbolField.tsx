import { useField } from 'formik';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { hasError } from 'utils/styles';
import InputV2 from 'components/base/InputV2';
import LabelWrapper from './LabelWrapper';

interface SymbolFieldProps {
  prefix?: string;
  forceError?: boolean;
  label: string;
  name: string;
}

export default function SymbolField(props: SymbolFieldProps): JSX.Element {
  const { prefix = '@', forceError, label, name } = props;

  const [field, meta] = useField(name);

  const errorVisible = hasError(meta, forceError);

  return (
    <Box>
      <LabelWrapper label={label} name={name} />
      <Flex
        css={{
          alignItems: 'center',
          background: '$black5',
          borderRadius: '$2',
          border: 'solid 1px $black10',
        }}
      >
        <Text size={2} css={{ paddingX: '$5', color: '$black50' }}>
          {prefix}
        </Text>

        <Flex css={{ position: 'relative', flex: 'auto', margin: -1 }}>
          <InputV2 {...field} {...props} isInvalid={errorVisible} />
        </Flex>
      </Flex>
    </Box>
  );
}
