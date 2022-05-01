import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import Box from 'components/base/Box';
import CardGrid from 'components/CardGrid';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import CreatorCard from 'components/cards/creator/CreatorCard';
import CreatorCardFollowState from 'components/cards/creator/CreatorCardFollowState';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserFollowStateByPublicKeys from 'hooks/queries/hasura/users/use-user-follow-state-by-public-keys';
import useOnceInViewport from 'hooks/use-once-in-viewport';

import { isAllTrue } from 'utils/helpers';

interface FeaturedCreatorsHomeProps {
  creators: UserFragment[];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function FeaturedCreatorsHome(props: FeaturedCreatorsHomeProps) {
  const { creators } = props;

  const { data: user, isLoading: isUserLoading } = useWalletSession();
  const queryClient = useQueryClient();

  const currentUserPublicKey = user?.publicAddress;

  const [isInViewport, targetRef] = useOnceInViewport();

  const creatorPublicKeys = creators.map((creator) => creator.publicKey);

  const { data: usersFollowStateData } = useUserFollowStateByPublicKeys(
    { publicKeys: creatorPublicKeys, currentUserPublicKey },
    { enabled: isAllTrue([!isUserLoading, isInViewport]) }
  );

  const onFollowUpdate = useCallback(() => {
    queryClient.refetchQueries('UserFollowStateByPublicKeys');
  }, [queryClient]);

  return (
    <Box>
      <Box ref={targetRef} />
      <FeaturedSectionHeading
        link={{ href: '/profiles', text: 'View all creators' }}
      >
        Featured creators
      </FeaturedSectionHeading>

      <CardGrid>
        {creators.map((creator) => {
          const followState = usersFollowStateData.find(
            (user) => user.publicKey === creator.publicKey
          );
          return (
            <CreatorCard
              creator={creator}
              key={creator.publicKey}
              hideBiosOnMobile={true}
              meta={
                <CreatorCardFollowState
                  publicKey={creator.publicKey}
                  followState={followState}
                  followsCount={
                    followState?.followerCount?.aggregate?.count ?? 0
                  }
                  onCompleted={onFollowUpdate}
                />
              }
            />
          );
        })}
      </CardGrid>
    </Box>
  );
}
