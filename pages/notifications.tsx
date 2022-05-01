import { useEffect } from 'react';
import { groupBy } from 'ramda';
import { styled } from 'stitches.config';
import format from 'date-fns/format';

import Box from 'components/base/Box';
import Text from 'components/base/Text';

import InfiniteScrollButton from 'components/feed/InfiniteScrollButton';
import NotificationFollowSkeleton from 'components/notifications/NotificationFollowSkeleton';
import GraySquare from 'components/base/GraySquare';
import NotificationFollow from 'components/notifications/NotificationFollow';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useNotificationsFollows from 'hooks/queries/hasura/use-notifications-followers';
import useLastReadNotificationsTimestamp from 'hooks/queries/hasura/use-last-read-notification-timestamp';
import { useUpdateUserLastReadNotificationAt } from 'graphql/server/mutations/update-user-last-read-notification-at.generated';

import { NotificationFollowUser } from 'types/Notification';

const Container = styled(Box, {
  maxWidth: 680,
  marginX: 'auto',
  paddingY: '$9',
});

const PageHeader = styled(Text, {
  fontFamily: '$body',
  fontSize: '$5',
  fontWeight: 600,
  letterSpacing: -1,
  textAlign: 'center',
  marginBottom: '$7',
});

const MonthHeader = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  textAlign: 'center',
  marginBottom: '$7',
});

const MonthWrapper = styled(Box, {
  marginBottom: '$9',
});

function SkeletonArray() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <NotificationFollowSkeleton
          key={i}
          css={{
            marginBottom: '$4',
          }}
        />
      ))}
    </>
  );
}

export default function NotificationsPage(): JSX.Element {
  const { data: user } = useWalletSession();

  const publicKey = user?.publicAddress;
  const token = user?.token;
  const { data: lastReadNotificationTimestampData } =
    useLastReadNotificationsTimestamp({ publicKey });

  const lastReadNotificationTimestamp =
    lastReadNotificationTimestampData?.user?.lastReadNotificationsAt;

  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } =
    useNotificationsFollows({
      publicKey,
      perPage: 20,
    });

  const followingUsers = data?.pages?.flatMap((d) => d.follow);
  const groupedFollowersByMonth = groupBy<NotificationFollowUser>((user) => {
    const eventDate = new Date(`${user?.updatedAt}Z`);
    return format(eventDate, 'MMMM y');
  })(followingUsers ?? []);

  const { mutate: updateUserLastReadNotificationAt } =
    useUpdateUserLastReadNotificationAt();

  useEffect(() => {
    if (token) {
      updateUserLastReadNotificationAt(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isLoading) {
    return (
      <Container>
        <PageHeader>Notifications</PageHeader>
        <Box
          css={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '$7',
          }}
        >
          <GraySquare />
        </Box>
        <SkeletonArray />
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>Notifications</PageHeader>
      {Object.entries(groupedFollowersByMonth)?.map(([key, users]) => {
        return (
          <MonthWrapper key={key}>
            <MonthHeader>{key}</MonthHeader>
            {users.map((user) => (
              <NotificationFollow
                key={user?.user?.publicKey}
                followerUser={user}
                currentUserPublicKey={publicKey}
                token={token}
                lastReadNotificationTimestamp={lastReadNotificationTimestamp}
              />
            ))}
          </MonthWrapper>
        );
      })}
      <InfiniteScrollButton
        handleNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </Container>
  );
}

NotificationsPage.getLayout = TransactionLayoutV2({
  title: 'Notifications',
  backgroundColor: '$black5',
});
