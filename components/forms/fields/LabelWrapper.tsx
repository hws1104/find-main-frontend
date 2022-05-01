import Flex from 'components/base/Flex';
import Text from 'components/base/Text';

interface LabelWrapperProps {
  label: string;
  isOptional?: boolean;
  name: string;
}

export default function LabelWrapper(props: LabelWrapperProps): JSX.Element {
  const { label, isOptional = false, name } = props;
  if (label || isOptional) {
    return (
      <Flex css={{ justifyContent: 'space-between', marginBottom: '$3' }}>
        {label && (
          <Text
            as="label"
            htmlFor={name}
            size={1}
            weight={600}
            css={{ color: '$black100' }}
          >
            {label}
          </Text>
        )}
        {isOptional && (
          <Text size={1} weight={600} css={{ color: '$black60' }}>
            Optional
          </Text>
        )}
      </Flex>
    );
  }
  return null;
}
