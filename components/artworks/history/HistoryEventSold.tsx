import NextLink from 'next/link';

import { HistoryEventProps } from './types';

import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import HistoryEventDate from './HistoryEventDate';
import HistoryEventAvatar from './HistoryEventAvatar';
import ETHinUSD from 'components/ETHinUSD';
import FollowPopover from 'components/follows/FollowPopover';
import Link from 'components/base/Link';
import Mono from 'components/base/Mono';

import { formatETHWithSuffix } from 'utils/formatters';
import { getUsernameOrAddressInfo, getUsernameOrAddress } from 'utils/helpers';
import Account from 'types/Account';

import { ArtworkEventFragment } from 'graphql/hasura/hasura-fragments.generated';

export default function HistoryEventSold(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent } = props;

  return (
    <Grid css={{ position: 'relative', justifyContent: 'center' }}>
      <Grid
        css={{
          justifyContent: 'center',
          textAlign: 'center',
          paddingY: '$4',
          paddingX: '$3',
          gap: 0,
          zIndex: 10,
          position: 'relative',
          '@bp0': { paddingY: '$6' },
        }}
      >
        <HistoryEventAvatar
          user={historyEvent.user}
          css={{
            marginX: 'auto',
            marginBottom: '$2',
          }}
        />
        <Grid css={{ gridGap: '$1' }}>
          <HistoryEventWonBy user={historyEvent.user} />
          <HistoryEventSoldFor historyEvent={historyEvent} />
          <HistoryEventDate date={historyEvent.blockTimestamp} />
        </Grid>
      </Grid>
      <Box
        css={{
          position: 'absolute',
          zIndex: 1,
          height: 1,
          backgroundColor: '$black10',
          width: '100%',
          left: 0,
          bottom: 42,
          '@bp0': { bottom: 57 },
        }}
      />
    </Grid>
  );
}

interface HistoryEventSoldForProps {
  historyEvent: ArtworkEventFragment;
}

function HistoryEventSoldFor(props: HistoryEventSoldForProps): JSX.Element {
  const { historyEvent } = props;

  return (
    <Text
      size={{ '@initial': 1, '@bp1': 2 }}
      weight={600}
      css={{ paddingX: '$6', backgroundColor: '$white100', marginX: 'auto' }}
    >
      Sold for {formatETHWithSuffix(historyEvent.data.amountInETH)}{' '}
      <Box as="span" css={{ color: '$black60' }}>
        <ETHinUSD amount={historyEvent.data.amountInETH} />
      </Box>
    </Text>
  );
}

interface HistoryEventWonByProps {
  user: Account;
}

function HistoryEventWonBy(props: HistoryEventWonByProps): JSX.Element {
  const { user } = props;

  const { usernameOrAddress, isAddress } = getUsernameOrAddressInfo(user);

  return (
    <Text
      size={{ '@initial': 1, '@bp1': 2 }}
      weight={600}
      css={{
        paddingX: '$6',
        backgroundColor: '$white100',
        marginX: 'auto',
        // TO DO: update PopoverCard to stitches
        ' > div': { display: 'inline-block', zIndex: 10 },
      }}
    >
      Auction won by{' '}
      <FollowPopover publicKey={user.publicKey}>
        <NextLink
          href={`/${getUsernameOrAddress(user)}`}
          prefetch={false}
          passHref
        >
          <Link
            css={{
              textDecoration: 'none',
              display: 'block',
              color: '$black60',
              transition: 'color $1 $ease',
              '@hover': {
                '&:hover': {
                  color: '$black100',
                },
              },
            }}
          >
            {isAddress ? (
              <Mono>{usernameOrAddress}</Mono>
            ) : (
              <Text weight={600} size={2}>
                {usernameOrAddress}
              </Text>
            )}
          </Link>
        </NextLink>
      </FollowPopover>
    </Text>
  );
}
