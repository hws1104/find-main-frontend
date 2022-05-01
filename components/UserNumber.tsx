import { ReactNode } from 'react';

import { padNumber } from 'utils/helpers';

import Flex from 'components/base/Flex';
import Mono from 'components/base/Mono';

interface UserNumberProps {
  userNumber: number;
}

export default function UserNumber(props: UserNumberProps): JSX.Element {
  const { userNumber } = props;
  return <UserTag>#{padNumber(userNumber)}</UserTag>;
}

export function CreatorTag(): JSX.Element {
  return <UserTag>Creator</UserTag>;
}

interface UserTagProps {
  children: ReactNode;
}

export function UserTag(props: UserTagProps): JSX.Element {
  const { children } = props;
  return (
    <Mono
      css={{
        fontSize: 12,
        paddingX: '$3',
        paddingY: 7,
        backgroundColor: '$black100',
        color: '$white100',
        letterSpacing: 1,
        borderRadius: '$round',
        textTransform: 'uppercase',
        '@bp0': { paddingX: '$4', paddingY: 9 },
        '@bp1': { fontSize: '$0' },
      }}
    >
      {children}
    </Mono>
  );
}

interface TagWrapperProps {
  children: ReactNode;
}

export function TagWrapper(props: TagWrapperProps): JSX.Element {
  const { children } = props;
  return (
    <Flex css={{ marginBottom: '$4', '@bp1': { marginBottom: '$6' } }}>
      {children}
    </Flex>
  );
}
