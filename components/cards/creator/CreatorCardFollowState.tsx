import { useEffect, useRef } from 'react';
import { useHoverDirty } from 'react-use';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

import ProfileFollowCount from 'components/profiles/ProfileFollowCount';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import { useCardContext } from '../CardContext';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { getFirstValue } from 'utils/helpers';

import { Follow } from 'graphql/hasura/types-hasura.generated';

type BasicFollow = Pick<Follow, 'createdAt' | 'isFollowing'>;

type FollowUser = {
  follows: BasicFollow[];
  followerCount: {
    aggregate?: { count: number };
  };
};

interface CreatorCardFollowStateProps {
  publicKey: string;
  followState: FollowUser;
  followsCount: number;
  onCompleted: () => void;
}

export default function CreatorCardFollowState(
  props: CreatorCardFollowStateProps
): JSX.Element {
  const { publicKey, followState, onCompleted } = props;

  const { data: user } = useWalletSession();

  const currentUserAddress = user?.publicAddress;

  const { setIsHovered } = useCardContext();

  const isFollowing = Boolean(getFirstValue(followState?.follows));
  const followerCount = followState?.followerCount?.aggregate?.count;

  const hoverRef = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(hoverRef);

  useEffect(() => {
    setIsHovered(isHovering);
  }, [isHovering, setIsHovered]);

  return (
    <Flex
      css={{
        marginTop: 'auto',
        padding: '$6',
        borderTop: 'solid 1px $black5',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
      ref={hoverRef}
    >
      <Box>
        <ProfileFollowCount followerCount={followerCount} label="Followers" />
      </Box>

      <FollowButtonConnected
        isFollowing={isFollowing}
        isLoading={false}
        publicKey={publicKey}
        currentUserPublicKey={currentUserAddress}
        onFollowSuccess={onCompleted}
      />
    </Flex>
  );
}
