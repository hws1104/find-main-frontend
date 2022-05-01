/* eslint-disable react/jsx-max-depth */
import { always, cond, propEq } from 'ramda';

import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import UserTagInline from 'components/users/UserTagInline';

import { EventType } from 'types/Event';

import { FollowedArtworkEvent } from 'hooks/queries/hasura/use-followed-artwork-events';

import { formatRelativeTimestamp } from 'utils/dates/dates';

const getEventText = cond([
  [propEq('eventType', EventType.Minted), always('minted')],
  [propEq('eventType', EventType.Listed), always('listed')],
  [propEq('eventType', EventType.PriceChanged), always('changed the price')],
  [propEq('eventType', EventType.Bid), always('placed a bid')],
]);

interface ArtworkCardEvent {
  event: FollowedArtworkEvent;
}

export default function ArtworkCardEvent(props: ArtworkCardEvent): JSX.Element {
  const { event } = props;
  const eventText = getEventText(event);

  return (
    <Flex
      css={{
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '$1',
        marginBottom: '$2',
      }}
    >
      <Flex css={{ alignItems: 'center' }}>
        <UserTagInline disableAvatar user={event?.user} />
        <Text weight={600} css={{ paddingLeft: '$1' }}>
          {eventText}
        </Text>
      </Flex>
      <Text weight={600} css={{ color: '$black60' }}>
        {formatRelativeTimestamp(event.blockTimestamp)}
      </Text>
    </Flex>
  );
}
