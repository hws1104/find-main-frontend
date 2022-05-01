import { ReactNode } from 'react';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';

interface GradientUsernameProps {
  children: ReactNode;
}

export default function GradientUsername(
  props: GradientUsernameProps
): JSX.Element {
  const { children } = props;
  return (
    <Flex css={{ maxWidth: '100%' }}>
      <Text
        color="rainbow"
        weight={600}
        size={{ '@initial': 2, '@bp1': 3 }}
        css={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-all',
        }}
      >
        {children}
      </Text>
    </Flex>
  );
}
