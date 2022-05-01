import Flex from 'components/base/Flex';
import GraySquare from 'components/base/GraySquare';
import FollowPopover from './FollowPopover';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';

import { getUsernameOrAddress } from 'utils/helpers';

interface SingleUserStackElement {
  userIndex?: number;
  publicKey?: string;
  profileImageUrl?: string;
}

interface UserStackProps<T> {
  users: T[];
}

interface UserStackElementProps<T> {
  user: T;
}

export default function UserStack<T extends SingleUserStackElement>(
  props: UserStackProps<T>
): JSX.Element {
  const { users } = props;

  return (
    <Flex>
      {users.map((user) => (
        <UserStackElement key={user.publicKey} user={user} />
      ))}
    </Flex>
  );
}

export function UserStackInteractive<T extends SingleUserStackElement>(
  props: UserStackProps<T>
): JSX.Element {
  const { users } = props;

  return (
    <Flex>
      {users.map((user) => (
        <FollowPopover key={user.publicKey} publicKey={user.publicKey}>
          <UserStackElement user={user} />
        </FollowPopover>
      ))}
    </Flex>
  );
}

function UserStackElement<T extends SingleUserStackElement>(
  props: UserStackElementProps<T>
): JSX.Element {
  const { user } = props;

  return (
    <Link href={`/${getUsernameOrAddress(user)}`} prefetch={false}>
      <a>
        <CircleAvatar
          publicKey={user.publicKey}
          imageUrl={user.profileImageUrl}
          css={{
            border: 'solid 3px $white100',
            marginRight: '-$2 !important',
            borderRadius: '$round',
          }}
        />
      </a>
    </Link>
  );
}

export function UserStackSkeleton(): JSX.Element {
  return (
    <Flex>
      {[...Array(5)].map((_, index) => (
        <GraySquare
          css={{
            width: 32,
            height: 32,
            border: 'solid 3px $white100',
            marginRight: -8,
            borderRadius: '$round',
          }}
          key={index}
        />
      ))}
    </Flex>
  );
}
