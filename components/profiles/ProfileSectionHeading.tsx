import { ReactNode } from 'react';

import Text from 'components/base/Text';

interface ProfileSectionHeadingProps {
  children: ReactNode;
}

export default function ProfileSectionHeading(
  props: ProfileSectionHeadingProps
): JSX.Element {
  const { children } = props;
  return (
    <Text
      size={2}
      weight={600}
      css={{
        borderBottom: 'solid 1px $black10',
        paddingBottom: '$4',
        lineHeight: 1,
        marginBottom: '$4',
      }}
    >
      {children}
    </Text>
  );
}
