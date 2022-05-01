import { useRef, useCallback } from 'react';
import { useHoverDirty } from 'react-use';
import { useQueryClient } from 'react-query';
import { assocPath } from 'ramda';

import { useCreateFollow } from 'graphql/server/mutations/create-follow.generated';
import { useRemoveFollow } from 'graphql/server/mutations/remove-follow.generated';
import useSegmentEvent from 'hooks/use-segment-event';

import { RenderProfileFollowButton } from 'components/profiles/ProfileFollowState';
import Flex from 'components/base/Flex';

import { QueryCacheKey } from 'types/Queries';
import { FollowFragment } from 'graphql/server/server-fragments.generated';

import { isAnyTrue } from 'utils/helpers';
import {
  UserFollowState,
  useUserFollowState,
} from 'graphql/hasura/queries/user-follow-state.generated';

type FollowSuccesFn = (res: FollowFragment) => void;
interface FollowButtonConnectedProps {
  publicKey: string;
  currentUserPublicKey: string;
  isFollowing: boolean;
  isLoading: boolean;
  isDark?: boolean;
  onFollowSuccess: FollowSuccesFn;
}

export default function FollowButtonConnected(
  props: FollowButtonConnectedProps
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    isLoading,
    isFollowing,
    isDark = false,
    onFollowSuccess,
  } = props;

  const [sendSegmentEvent] = useSegmentEvent();

  const queryClient = useQueryClient();

  const handleSuccess: FollowSuccesFn = (res) => {
    onFollowSuccess(res);
    queryClient.invalidateQueries(QueryCacheKey.FollowState);
  };

  // manually set the follow state in the cache
  // it is much faster than refetching the data
  const handleQueryCache = useCallback(
    (follow: FollowFragment) => {
      queryClient.setQueryData<UserFollowState>(
        useUserFollowState.getKey({
          publicKey: follow.followedUser.publicKey,
          currentUserPublicKey: follow.user.publicKey,
        }),
        assocPath(
          ['user', 'isFollowingUser', 'aggregate', 'count'],
          follow.isFollowing ? 1 : 0
        )
      );
    },
    [queryClient]
  );

  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);

  const { mutate: createFollow, isLoading: isCreateFollowLoading } =
    useCreateFollow({
      onSuccess: (res) => {
        handleQueryCache(res.createFollow);
        handleSuccess(res.createFollow);
        sendSegmentEvent({
          eventName: 'follow_create',
          payload: {
            followedUser: res.createFollow.followedUser.publicKey,
            followingUser: res.createFollow.user.publicKey,
          },
        });
      },
    });

  const { mutate: removeFollow, isLoading: isRemoveFollowLoading } =
    useRemoveFollow({
      onSuccess: (res) => {
        handleQueryCache(res.removeFollow);
        handleSuccess(res.removeFollow);
        sendSegmentEvent({
          eventName: 'follow_remove',
          payload: {
            followedUser: res.removeFollow.followedUser.publicKey,
            followingUser: res.removeFollow.user.publicKey,
          },
        });
      },
    });

  const isStateLoading = isAnyTrue([
    isLoading,
    isCreateFollowLoading,
    isRemoveFollowLoading,
  ]);

  return (
    <Flex ref={hoverRef}>
      <RenderProfileFollowButton
        isFollowing={isFollowing}
        isLoading={isStateLoading}
        isHovering={isHovering}
        followUser={() => createFollow({ publicKey })}
        unfollowUser={() => removeFollow({ publicKey })}
        publicKey={publicKey}
        currentUserPublicKey={currentUserPublicKey}
        isDark={isDark}
      />
    </Flex>
  );
}
