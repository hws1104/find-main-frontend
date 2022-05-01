import { useField } from 'formik';

import Text from 'components/base/Text';

interface CharacterCounterProps {
  maxLength: number;
  name: string;
  className?: string;
}

export default function CharacterCounter(
  props: CharacterCounterProps
): JSX.Element {
  const [field] = useField(props);
  const { maxLength = 200 } = props;

  const fieldLength = field?.value?.length ?? 0;

  const lengthExceeded = fieldLength > maxLength;

  return (
    <Text
      size={0}
      css={{
        color: lengthExceeded ? '$red100' : '$black50',
        paddingTop: '$2',
        textAlign: 'right',
        letterSpacing: '0.025em',
      }}
    >
      {fieldLength}/{maxLength}
    </Text>
  );
}
