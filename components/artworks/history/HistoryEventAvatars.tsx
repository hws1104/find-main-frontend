import { head, last } from 'ramda';
import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import HistoryEventAvatar from './HistoryEventAvatar';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface HistoryEventAvatarsProps {
  users: UserFragment[];
  className?: string;
}

const Avatars = styled(Flex, {
  flexDirection: 'column',
  marginRight: '$4',
  '@bp1': {
    flexDirection: 'row',
    marginRight: 0,
  },
});

export default function HistoryEventAvatars(
  props: HistoryEventAvatarsProps
): JSX.Element {
  const { users } = props;

  const transferredFrom = head(users);
  const transferredTo = last(users);

  if (transferredFrom && transferredTo) {
    return (
      <Avatars>
        <HistoryEventAvatar
          user={transferredFrom}
          css={{
            zIndex: 2,
            marginBottom: -12,
            marginRight: 0,
            '@bp0': {
              marginBottom: 0,
              marginRight: -12,
            },
          }}
        />
        <HistoryEventAvatar
          user={transferredTo}
          css={{
            zIndex: 1,
            marginRight: 0,
            '@bp0': {
              marginRight: '$4',
            },
          }}
        />
      </Avatars>
    );
  } else if (transferredFrom) {
    return (
      <Avatars>
        <HistoryEventAvatar
          user={transferredFrom}
          css={{
            zIndex: 2,
            marginRight: 0,
            '@bp0': {
              marginRight: '$4',
            },
          }}
        />
      </Avatars>
    );
  }
  return (
    <Avatars>
      <HistoryEventAvatar
        user={transferredTo}
        css={{
          zIndex: 2,
          marginRight: 0,
          '@bp0': {
            marginRight: '$4',
          },
        }}
      />
    </Avatars>
  );
}
