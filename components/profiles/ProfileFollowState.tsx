import NextLink from 'next/link';
import { useQueryClient } from 'react-query';
import { useCallback } from 'react';

import { areKeysEqual } from 'utils/users';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import SpinnerStroked from 'components/SpinnerStroked';
import ProfileFollowCount from './ProfileFollowCount';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';

import useFollowModal from 'hooks/use-follow-modal';
import useModal from 'hooks/use-modal';
import { useUserFollowState } from 'graphql/hasura/queries/user-follow-state.generated';
import { UserFollowStateSelected } from 'hooks/queries/hasura/users/use-user-follow-state';

import { ModalMode, ModalKey } from 'types/modal';

interface ProfileFollowStateProps {
  publicKey: string;
  currentUserPublicKey: string;
  userFollowState: UserFollowStateSelected;
}

export default function ProfileFollowState(
  props: ProfileFollowStateProps
): JSX.Element {
  const { publicKey, currentUserPublicKey, userFollowState } = props;

  const queryClient = useQueryClient();

  const { toggleModal } = useFollowModal(publicKey);

  const followerCount = userFollowState?.followerCount;
  const followingCount = userFollowState?.followingCount;

  const refetchFollowCounts = useCallback(() => {
    queryClient.invalidateQueries(
      useUserFollowState.getKey({ publicKey, currentUserPublicKey })
    );
  }, [queryClient, publicKey, currentUserPublicKey]);

  return (
    <>
      <Flex css={{ alignItems: 'center' }}>
        <Box
          css={{ marginRight: '$5', cursor: 'pointer' }}
          onClick={() => toggleModal(ModalMode.Following)}
        >
          <ProfileFollowCount
            label="Following"
            followerCount={followingCount}
          />
        </Box>
        <Box
          css={{ marginRight: '$5', cursor: 'pointer' }}
          onClick={() => toggleModal(ModalMode.Followers)}
        >
          <ProfileFollowCount label="Followers" followerCount={followerCount} />
        </Box>
        <FollowButtonConnected
          isLoading={false}
          isFollowing={userFollowState?.isFollowingUser}
          publicKey={publicKey}
          currentUserPublicKey={currentUserPublicKey}
          onFollowSuccess={refetchFollowCounts}
        />
      </Flex>
    </>
  );
}

interface RenderProfileFollowButtonProps {
  followUser: () => void;
  unfollowUser: () => void;
  isLoading: boolean;
  isFollowing: boolean;
  isHovering: boolean;
  currentUserPublicKey: string;
  publicKey: string;
  isDark: boolean;
}

export function RenderProfileFollowButton(
  props: RenderProfileFollowButtonProps
): JSX.Element {
  const {
    followUser,
    unfollowUser,
    isLoading,
    isFollowing,
    isHovering,
    currentUserPublicKey,
    publicKey,
    isDark,
  } = props;

  const isMyProfile = areKeysEqual([currentUserPublicKey, publicKey]);

  if (!currentUserPublicKey) {
    return <ProfileFollowButtonConnect isDark={isDark} />;
  }

  if (isMyProfile) {
    return (
      <NextLink href="/profile" passHref>
        <a style={{ display: 'block', textDecoration: 'none' }}>
          <FollowButton color="white" shape="round" size="medium">
            Edit Profile
          </FollowButton>
        </a>
      </NextLink>
    );
  }

  if (isLoading) {
    return (
      <FollowButton
        color="black"
        shape="round"
        size="medium"
        css={{ pointerEvents: 'none' }}
      >
        <Flex css={{ justifyContent: 'center' }}>
          <SpinnerStroked size={22} />
        </Flex>
      </FollowButton>
    );
  }

  if (isFollowing) {
    return isHovering ? (
      <FollowButton
        color="red"
        shape="round"
        size="medium"
        onClick={unfollowUser}
      >
        Unfollow
      </FollowButton>
    ) : (
      <FollowButton
        color="black"
        shape="round"
        size="medium"
        onClick={unfollowUser}
      >
        Following
      </FollowButton>
    );
  }

  return (
    <FollowButton
      color="white"
      shape="round"
      size="medium"
      onClick={followUser}
    >
      Follow
    </FollowButton>
  );
}

interface ProfileFollowButtonConnectProps {
  isDark: boolean;
}

export function ProfileFollowButtonConnect(
  props: ProfileFollowButtonConnectProps
): JSX.Element {
  const { isDark } = props;

  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  return (
    <FollowButton
      color={isDark ? 'black' : 'white'}
      shape="round"
      size="medium"
      onClick={openModal}
    >
      Follow
    </FollowButton>
  );
}

const FollowButton = styled(Button, {
  minWidth: 120,
  fontSize: '$2',
});
