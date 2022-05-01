/* eslint-disable react/jsx-max-depth */
import NextLink from 'next/link';

import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Mono from 'components/base/Mono';
import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Link from 'components/base/Link';
import FollowButtonConnected from 'components/follows/FollowButtonConnected';
import Avatar, { AvatarProps } from 'components/base/Avatar';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import { getUsernameOrAddressInfo } from 'utils/helpers';
import { areKeysEqual, getAvatarByPublicKey } from 'utils/users';
import { buildAvatarUrl } from 'utils/assets';

import { styled } from 'stitches.config';

import Account from 'types/Account';

interface ModalRowVirtualizedProps {
  user: Account & {
    isFollowingUser: {
      aggregate?: { count?: number };
    };
  };
  onFollowUpdate: () => void;
  isLoading: boolean;
  isFollowing: boolean;
}

export default function ModalRowVirtualized(
  props: ModalRowVirtualizedProps
): JSX.Element {
  const { user, isFollowing, onFollowUpdate, isLoading } = props;

  const { data: walletUser } = useWalletSession();

  const publicKey = user.publicKey;

  const currentUserPublicAddress = walletUser?.publicAddress;

  const isMyProfile = areKeysEqual([publicKey, currentUserPublicAddress]);

  const { userPath, nameOrUsername, usernameOrAddress } =
    getUsernameOrAddressInfo(user);

  return (
    <ModalRowContainer>
      {/* TODO: extract this into a shared
      component across splits + trending */}
      <NextLink href={`/${userPath}`} prefetch={false} passHref>
        <AvatarRowLink>
          <Flex css={{ marginRight: '$4', '@bp0': { marginRight: '$6' } }}>
            <ModalRowAvatar
              publicKey={user.publicKey}
              imageUrl={buildAvatarUrl(50, user.profileImageUrl)}
              alt={nameOrUsername}
              shape="round"
            />
          </Flex>
          <Grid>
            {nameOrUsername ? (
              <>
                <Heading
                  size={{ '@initial': 2, '@bp0': 3 }}
                  css={{ color: '$black100' }}
                >
                  {nameOrUsername}
                </Heading>
                <Heading size={1} css={{ display: 'flex' }}>
                  <Text color="rainbow">{usernameOrAddress}</Text>
                </Heading>
              </>
            ) : (
              <Mono size={2} css={{ color: '$black100' }}>
                {usernameOrAddress}
              </Mono>
            )}
          </Grid>
        </AvatarRowLink>
      </NextLink>
      {!isMyProfile && (
        <Flex css={{ display: 'none', '@bp0': { display: 'flex' } }}>
          <FollowButtonConnected
            isFollowing={isFollowing}
            isLoading={isLoading}
            publicKey={publicKey}
            currentUserPublicKey={currentUserPublicAddress}
            onFollowSuccess={onFollowUpdate}
          />
        </Flex>
      )}
    </ModalRowContainer>
  );
}

const ModalRowContainer = styled(Flex, {
  flex: 1,
  alignItems: 'center',
  transition: 'background $0 ease',
  '@bp0': {
    paddingRight: '$5',
    borderRadius: '$3',
  },
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: '$black5',
    },
  },
});

const AvatarRowLink = styled(Link, {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  textDecoration: 'none',
  paddingY: '$2',
  paddingX: '$6',
  '@bp0': {
    paddingY: '$6',
    paddingRight: '$0',
  },
  '&:focus': {
    outline: 'none',
  },
});

interface ModalRowAvatarProps extends AvatarProps {
  publicKey: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function ModalRowAvatar(props: ModalRowAvatarProps) {
  const { publicKey, ...rest } = props;

  const avatarBackground = getAvatarByPublicKey(publicKey);

  return (
    <Avatar
      {...rest}
      css={{
        background: avatarBackground,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: 32,
        height: 32,
        '@bp0': {
          width: 50,
          height: 50,
        },
      }}
    />
  );
}
