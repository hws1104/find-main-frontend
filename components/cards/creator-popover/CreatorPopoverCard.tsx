/* eslint-disable react/jsx-max-depth */
import { CSS } from 'stitches.config';
import NextLink from 'next/link';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserFollowState from 'hooks/queries/hasura/users/use-user-follow-state';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import CircleAvatar from 'components/avatars/CircleAvatar';
import GraySquare from 'components/base/GraySquare';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import FollowsAvatars from 'components/follows/FollowsAvatars';
import CreatorPopoverFollowCount from './CreatorPopoverFollowCount';
import CreatorCardHeading from '../creator/CreatorCardHeading';
import CreatorCardSubheading from '../creator/CreatorCardSubheading';
import Link from 'components/base/Link';
import MarkdownText from 'components/base/MarkdownText';

import { areKeysEqual } from 'utils/users';
import {
  getUsernameOrAddress,
  notEmptyOrNil,
  truncateString,
} from 'utils/helpers';

interface CreatorPopoverCardProps {
  publicKey: string;
  isLazyLoaded: boolean;
  css?: CSS;
}

export default function CreatorPopoverCard(
  props: CreatorPopoverCardProps
): JSX.Element {
  const { publicKey, isLazyLoaded, css } = props;

  const { data: walletUser } = useWalletSession();

  const currentUserPublicKey = walletUser?.publicAddress;

  const isOwnProfile = areKeysEqual([currentUserPublicKey, publicKey]);

  const { data: userData, isLoading: userLoading } = useUserByPublicKey(
    { publicKey },
    {
      enabled: isLazyLoaded,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 3600,
    }
  );

  const user = userData?.user;

  const { data: followData, isLoading: followStateLoading } =
    useUserFollowState(
      { publicKey, currentUserPublicKey },
      {
        enabled: isLazyLoaded,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 3600,
      }
    );

  const followerCount = followData?.followerCount ?? 0;
  const followingCount = followData?.followingCount ?? 0;

  const hasNoFollowers = followData && followerCount === 0;

  const isFollowing = followData?.isFollowingUser;

  const hasBio = notEmptyOrNil(user?.bio);

  return (
    <Box
      css={{
        boxShadow: '$3',
        backgroundColor: '$white100',
        minWidth: 340,
        maxWidth: 340,
        borderRadius: '$3',
        color: '$black100',
        ...(css as any),
      }}
    >
      <Box css={{ paddingX: '$7', paddingTop: '$7', paddingBottom: '$5' }}>
        <Box css={{ position: 'relative' }}>
          <NextLink href={`/${getUsernameOrAddress(user)}`} passHref>
            <Link
              css={{
                textDecoration: 'none',
                display: 'block',
                color: 'currentcolor',
              }}
            >
              <Box css={{ marginBottom: '$6' }}>
                <CircleAvatar
                  imageUrl={user?.profileImageUrl}
                  publicKey={user?.publicKey}
                  maxSize={72}
                  css={{ width: 72, height: 72 }}
                />
              </Box>

              {userLoading ? (
                <CardHeadingSkeleton />
              ) : (
                <Grid css={{ gap: 5, marginBottom: '$4' }}>
                  <Flex>
                    <CreatorCardHeading user={user} />
                  </Flex>

                  <CreatorCardSubheading user={user} />
                </Grid>
              )}
            </Link>
          </NextLink>

          {!isOwnProfile && (
            <Box css={{ position: 'absolute', top: 0, right: 0 }}>
              <FollowButtonConnected
                isFollowing={isFollowing}
                isLoading={followStateLoading}
                publicKey={publicKey}
                currentUserPublicKey={currentUserPublicKey}
                onFollowSuccess={() => void 0}
              />
            </Box>
          )}
        </Box>

        <Grid css={{ gap: '$4' }}>
          {userLoading ? (
            <GraySquare
              css={{ height: 50, backgroundColor: '$black5', width: '100%' }}
            />
          ) : hasBio ? (
            <MarkdownText css={{ fontSize: '$1' }}>
              {truncateString(180, user?.bio)}
            </MarkdownText>
          ) : null}

          {/* keep the component mounted so that the queries can fire
          instead we just hide it when there’s no followers to show */}
          <Flex
            css={{
              alignItems: 'center',
              display: hasNoFollowers ? 'none' : 'flex',
            }}
          >
            <Text weight={600} size={1} css={{ marginRight: '$2' }}>
              Followed by
            </Text>
            <FollowsAvatars
              publicKey={publicKey}
              currentUserPublicKey={currentUserPublicKey}
              isQueryEnabled={isLazyLoaded}
              isInteractive={false}
              avatarsCount={5}
            />
          </Flex>
        </Grid>
      </Box>
      <Flex
        css={{
          paddingTop: '$5',
          paddingBottom: '$6',
          paddingX: '$7',
          borderTop: 'solid 1px $black5',
        }}
      >
        <CreatorPopoverFollowCount
          user={user}
          count={followingCount}
          label="Following"
        />

        <CreatorPopoverFollowCount
          user={user}
          count={followerCount}
          label="Followers"
        />
      </Flex>
    </Box>
  );
}

function CardHeadingSkeleton(): JSX.Element {
  return (
    <Grid css={{ gap: 5, marginBottom: '$4' }}>
      <GraySquare
        css={{ height: 46, width: 200, backgroundColor: '$black5' }}
      />
      <GraySquare css={{ height: 31, width: 160 }} />
    </Grid>
  );
}
