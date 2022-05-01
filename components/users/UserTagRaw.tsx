import { CSS } from 'stitches.config';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import CircleAvatar from 'components/avatars/CircleAvatar';
import UserTagRawSkeleton from './UserTagSkeleton';
import UserTagContainer from './UserTagContainer';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { maybeLowerCase } from 'utils/case';

import Account from 'types/Account';

interface UserTagProps {
  user: Account;
  css?: CSS;
  isLoading?: boolean;
}

export default function UserTagRaw(props: UserTagProps): JSX.Element {
  const { user, css, isLoading } = props;

  const usernameOrAddress = getUsernameOrTruncatedAddress(user);

  const hasClaimedUsername = hasUsername(user);

  const avatarUrl = user?.profileImageUrl;

  if (isLoading) {
    return <UserTagRawSkeleton css={css as any} />;
  }

  return (
    <UserTagContainer css={css as any}>
      <CircleAvatar
        maxSize={34}
        publicKey={user?.publicKey}
        imageUrl={avatarUrl}
        css={{ width: 24, height: 24, '@bp0': { width: 34, height: 34 } }}
      />
      <Flex>
        <Text
          size={{ '@initial': 0, '@bp0': 1 }}
          css={{
            marginLeft: '$2',
            textDecoration: 'none',
            position: 'relative',
            color: 'currentColor',
            top: -2,
            fontFamily: hasClaimedUsername ? '$body' : '$mono',
            fontWeight: hasClaimedUsername ? 600 : 400,
          }}
          className="username-tag"
        >
          {maybeLowerCase(usernameOrAddress)}
        </Text>
      </Flex>
    </UserTagContainer>
  );
}
