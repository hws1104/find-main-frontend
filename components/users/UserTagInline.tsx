import NextLink from 'next/link';
import { VariantProps } from '@stitches/react';
import { styled, CSS } from 'stitches.config';
import { ReactNode } from 'react';

import { SquareAvatar } from 'components/base/Avatar';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Mono from 'components/base/Mono';
import Text from 'components/base/Text';
import FollowPopover from 'components/follows/FollowPopover';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/base/Link';

import { buildAvatarUrl } from 'utils/assets';
import { getUsernameOrAddressInfo } from 'utils/helpers';

import { TagUser } from './UserTagV3';

const UserTagInlineContainer = styled(Flex, {
  alignItems: 'center',
  willChange: 'transform',
  padding: 0,
  transition: 'color $0 $ease',
  color: '$black60',
  '@hover': {
    '&:hover': {
      color: '$black100',
    },
  },
});

interface UserTagInlineProps
  extends VariantProps<typeof UserTagInlineContainer> {
  user: TagUser;
  disablePopover?: boolean;
  css?: CSS;
  disableAvatar?: boolean;
  avatarSize?: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function UserTagInline(props: UserTagInlineProps) {
  const {
    user,
    disablePopover = false,
    disableAvatar = false,
    avatarSize = 32,
    css,
  } = props;

  // TODO: return null when loading/not present
  if (!user) {
    return null;
  }

  const avatarImageUrl = buildAvatarUrl(avatarSize, user.profileImageUrl);

  const { usernameOrAddress, hasUsername, userPath } =
    getUsernameOrAddressInfo(user);

  return (
    <MaybeRenderPopover
      disablePopover={disablePopover}
      publicKey={user.publicKey}
    >
      <NextLink href={`/${userPath}`} passHref prefetch={false}>
        <Link
          css={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'block',
            ...(css as any),
          }}
        >
          <UserTagInlineContainer>
            <Box css={{ marginRight: '$2' }}>
              {!disableAvatar &&
                (avatarImageUrl ? (
                  <SquareAvatar
                    imageUrl={avatarImageUrl}
                    alt={usernameOrAddress}
                    shape="round"
                    size={avatarSize}
                  />
                ) : (
                  <CircleAvatar
                    publicKey={user.publicKey}
                    maxSize={avatarSize}
                    css={{ width: avatarSize, height: avatarSize }}
                  />
                ))}
            </Box>
            {hasUsername ? (
              <Text
                size={1}
                weight={600}
                css={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {usernameOrAddress}
              </Text>
            ) : (
              <Mono
                size={1}
                tight
                css={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {usernameOrAddress}
              </Mono>
            )}
          </UserTagInlineContainer>
        </Link>
      </NextLink>
    </MaybeRenderPopover>
  );
}

interface MaybeRenderPopoverProps {
  disablePopover: boolean;
  publicKey: string;
  children: ReactNode;
}

function MaybeRenderPopover(props: MaybeRenderPopoverProps) {
  const { disablePopover, publicKey, children } = props;

  // popover is enabled, so wrap the child component
  if (!disablePopover) {
    return <FollowPopover publicKey={publicKey}>{children}</FollowPopover>;
  }

  // otherwise return just the child component
  return <>{children}</>;
}
