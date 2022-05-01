import { styled } from 'stitches.config';
import NextLink from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Link from 'components/base/Link';

import useLastReadNotificationsTimestamp from 'hooks/queries/hasura/use-last-read-notification-timestamp';
import useNotificationsCount from 'hooks/queries/hasura/use-notifications-count';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import LightningIcon from 'assets/icons/lightning.svg';
import Text from 'components/base/Text';

export default function NotificationsLink(): JSX.Element {
  const { data: user } = useWalletSession();
  const publicKey = user?.publicAddress;

  const {
    data: lastReadNotificationTimestampData,
    isSuccess: lastReadNotificationTimestampSuccess,
  } = useLastReadNotificationsTimestamp({ publicKey });

  const { data: notificationsCountData } = useNotificationsCount({
    publicKey,
    lastReadTimestamp:
      lastReadNotificationTimestampData?.user?.lastReadNotificationsAt,
    enabled: lastReadNotificationTimestampSuccess,
  });

  const unreadCount =
    notificationsCountData?.notificationsCount?.aggregate?.count;
  const hasUnread = unreadCount > 0;

  return (
    <Box
      css={{
        position: 'relative',
        marginLeft: hasUnread ? '$8' : '$6',
        marginRight: '$5',
      }}
    >
      <NextLink href="/notifications" passHref>
        <NotificationWrapper>
          {hasUnread && (
            <NotificationStatus>
              <Text size={1} weight={600}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </NotificationStatus>
          )}
          <LightningIcon width={18} style={{ display: 'block' }} />
        </NotificationWrapper>
      </NextLink>
    </Box>
  );
}

const NotificationWrapper = styled(Link, {
  display: 'flex',
  textDecoration: 'none',
  color: 'inherit',
  backgroundColor: '$white100',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: 44,
  height: 44,
  boxShadow: '$0',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  borderRadius: '$round',
  '@hover': {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '$1',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '$1',
  },
});

const NotificationStatus = styled(Flex, {
  fontSize: '$2',
  minWidth: 32,
  height: 32,
  position: 'absolute',
  padding: '$1',
  lineHeight: 1,
  backgroundColor: '$red100',
  borderRadius: '$round',
  color: '$white100',
  left: '-50%',
  bottom: '50%',
  transform: 'translateY(50%)',
  justifyContent: 'center',
  alignItems: 'center',
});
