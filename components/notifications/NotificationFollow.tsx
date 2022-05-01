import Link from 'next/link';
import { styled } from 'stitches.config';
import { isAfter } from 'date-fns';
import { useQueryClient } from 'react-query';

import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Mono from 'components/base/Mono';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { formatRelativeTimestamp } from 'utils/dates/dates';

import { NotificationFollowUser } from 'types/Notification';
import { QueryCacheKey } from 'types/Queries';

const Container = styled(Flex, {
  alignItems: 'center',
  position: 'relative',
  borderRadius: '$2',
  padding: '$6',
  cursor: 'pointer',
  marginBottom: '$4',
  transition:
    'transform $1 $ease, background-color $2 $ease, box-shadow $2 $ease',
  willChange: 'transform',
  border: '2px solid $black10',
  '@hover': {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '$0',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'unset',
  },
  variants: {
    isNew: {
      true: {
        backgroundColor: '$white100',
        border: 'none',
      },
      false: {
        backgroundColor: '$black5',
        border: '2px solid $black10',
      },
    },
  },
});

const ProfileLink = styled(Box, {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const TimeAgo = styled(Text, {
  color: '$black50',
});

const ContentWrapper = styled(Flex, {
  marginBottom: '$1',
  alignItems: 'baseline',
});

const Username = styled(Text, {
  color: '$black60',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const Event = styled(Text, {
  color: '$black100',
  marginLeft: '$1',
  flexShrink: 0,
});

interface NotificationFollowProps {
  followerUser: NotificationFollowUser;
  currentUserPublicKey: string;
  token: string;
  lastReadNotificationTimestamp?: string;
}

export default function NotificationFollow(
  props: NotificationFollowProps
): JSX.Element {
  const {
    token,
    currentUserPublicKey,
    followerUser,
    lastReadNotificationTimestamp,
  } = props;

  const profilePath = buildUserProfilePath({ user: followerUser?.user });
  const userHasUsername = hasUsername(followerUser?.user);
  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(
    followerUser?.user
  );
  const isCurrentUserFollowing = followerUser?.user?.follows.length > 0;

  const followedAtTimestamp = followerUser?.updatedAt;

  const relativeFollowedAtTimestamp =
    formatRelativeTimestamp(followedAtTimestamp);

  const queryClient = useQueryClient();

  const onFollowSuccess = () => {
    queryClient.invalidateQueries(QueryCacheKey.RecentFollows);
    queryClient.invalidateQueries(QueryCacheKey.NotificationsFollows);
  };

  const isNew = isAfter(
    new Date(followedAtTimestamp),
    new Date(lastReadNotificationTimestamp)
  );

  return (
    <Container isNew={isNew}>
      <Link href={profilePath} passHref>
        <ProfileLink as="a"></ProfileLink>
      </Link>
      <Box css={{ marginRight: '$3', position: 'relative' }}>
        <Link href={profilePath} passHref>
          <a>
            <CircleAvatar
              maxSize={50}
              css={{ width: 50, height: 50 }}
              publicKey={followerUser?.user?.publicKey}
              imageUrl={followerUser?.user?.profileImageUrl}
            />
          </a>
        </Link>
      </Box>
      <Box css={{ marginRight: '$5', flexGrow: 0, minWidth: 0 }}>
        <ContentWrapper>
          {userHasUsername ? (
            <Username weight={600} size={1}>
              {usernameOrTruncatedAddress}
            </Username>
          ) : (
            <Mono
              size={0}
              css={{
                color: '$black60',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {usernameOrTruncatedAddress}
            </Mono>
          )}
          <Event weight={600} size={1}>
            followed you
          </Event>
        </ContentWrapper>
        <TimeAgo size={0}>{relativeFollowedAtTimestamp}</TimeAgo>
      </Box>
      <Box css={{ marginLeft: 'auto' }}>
        <FollowButtonConnected
          publicKey={followerUser?.user?.publicKey}
          currentUserPublicKey={currentUserPublicKey}
          isFollowing={isCurrentUserFollowing}
          onFollowSuccess={onFollowSuccess}
          isLoading={!followerUser}
        />
      </Box>
    </Container>
  );
}
