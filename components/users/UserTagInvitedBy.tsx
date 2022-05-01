import { ReactNode } from 'react';
import NextLink from 'next/link';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Link from 'components/base/Link';

import Account from 'types/Account';
import InviteCode from 'types/InviteCode';

import {
  getUsernameOrAddress,
  getUsernameOrTruncatedAddress,
  hasUsername,
} from 'utils/helpers';
import { maybeLowerCase } from 'utils/case';

import CircleAvatar from 'components/avatars/CircleAvatar';
import UserTagContainer from './UserTagContainerV2';
import { useUserByPublicKey } from 'graphql/hasura/queries/user-by-public-key.generated';

interface UserTagProps {
  invite: InviteCode;
  className?: string;
}

export default function UserTagInvitedBy(props: UserTagProps): JSX.Element {
  const { invite } = props;

  const inviteSenderPublicKey = invite?.senderPublicKey;

  const { data, isLoading } = useUserByPublicKey(
    { publicKey: inviteSenderPublicKey },
    { refetchOnWindowFocus: false }
  );

  const fallbackUser: Account = { publicKey: inviteSenderPublicKey };

  const user = data?.user ?? fallbackUser;

  if (user?.isAdmin || !inviteSenderPublicKey || isLoading) {
    return null;
  }

  return (
    <UserTagInvitedByContainer user={user}>
      <UserTagInviteByContent user={user} />
    </UserTagInvitedByContainer>
  );
}

interface UserTagInvitedByContainerProps {
  user: Account;
  children: ReactNode;
}

function UserTagInvitedByContainer(
  props: UserTagInvitedByContainerProps
): JSX.Element {
  const { user, children } = props;

  const usernameOrAddress = getUsernameOrAddress(user);

  if (!usernameOrAddress) {
    return (
      <UserTagContainer
        hoverable
        css={{
          backgroundColor: '$white100',
          zIndex: 3,
          paddingLeft: '$4',
          paddingY: '$3',
          height: 'auto',
        }}
      >
        <Flex
          css={{
            justifyContent: 'flex-start',
            textDecoration: 'none',
            pointerEvents: 'none',
          }}
        >
          {children}
        </Flex>
      </UserTagContainer>
    );
  }

  return (
    <NextLink href={`/${usernameOrAddress}`} passHref prefetch={false}>
      <Link
        css={{
          display: 'flex',
          justifyContent: 'flex-start',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <UserTagContainer
          hoverable
          css={{
            backgroundColor: '$white100',
            zIndex: 3,
            paddingLeft: '$4',
            paddingY: '$3',
            height: 'auto',
          }}
        >
          {children}
        </UserTagContainer>
      </Link>
    </NextLink>
  );
}

interface UserTagInviteByContentProps {
  user: Account;
}

function UserTagInviteByContent(
  props: UserTagInviteByContentProps
): JSX.Element {
  const { user } = props;

  const usernameOrAddress = getUsernameOrTruncatedAddress(user);

  const hasClaimedUsername = hasUsername(user);

  const avatarUrl = user?.profileImageUrl;

  return (
    <>
      <UserTagText>
        <Text weight={600} css={{ marginRight: '0.5ch' }}>
          Invited by
        </Text>
        <Text
          weight={hasClaimedUsername ? 600 : 400}
          css={{ fontFamily: hasClaimedUsername ? '$body' : '$mono' }}
        >
          {maybeLowerCase(usernameOrAddress)}
        </Text>
      </UserTagText>
      <CircleAvatar
        maxSize={24}
        css={{ width: 24, height: 24 }}
        publicKey={user?.publicKey}
        imageUrl={avatarUrl}
      />
    </>
  );
}

interface UserTagTextProps {
  children: ReactNode;
  className?: string;
}

function UserTagText(props: UserTagTextProps): JSX.Element {
  const { children } = props;
  return (
    <Text
      weight={600}
      size={0}
      css={{
        display: 'flex',
        alignItems: 'center',
        color: '$black100',
        position: 'relative',
        top: -1,
        textDecoration: 'none',
        marginRight: '$3',
      }}
    >
      {children}
    </Text>
  );
}
