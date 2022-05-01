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

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

import { buildAvatarUrl } from 'utils/assets';
import { getUsernameOrAddressInfo } from 'utils/helpers';

import { PartialPick } from 'types/utils';

const UserTagContainer = styled(Flex, {
  alignItems: 'center',
  borderRadius: '$round',

  paddingY: '$2',
  paddingRight: '$6',
  paddingLeft: 11,

  willChange: 'transform',
  transition: 'transform $1 $ease, box-shadow $1 $ease',

  variants: {
    hoverable: {
      true: {
        '@hover': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '$1',
            color: '$black100',
            background: '$white100',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '$0',
            color: '$black100',
            background: '$white100',
          },
        },
      },
    },
    appearance: {
      normal: {
        color: '$black100',
        background: '$white100',
        boxShadow: '$0',
      },
      frosted: {
        color: '$white100',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        transition:
          'transform $1 $ease, color $1 $ease, background $1 $ease, box-shadow $1 $ease',
      },
    },
  },
});

// we only require a subset of fields for this component
export type TagUser = PartialPick<
  UserFragment,
  'profileImageUrl' | 'userIndex' | 'username'
> &
  Pick<UserFragment, 'publicKey'>;

interface UserTagV3Props extends VariantProps<typeof UserTagContainer> {
  user: TagUser;
  disablePopover?: boolean;
  css?: CSS;
  disableAvatar?: boolean;
  avatarSize?: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function UserTagV3(props: UserTagV3Props) {
  const {
    user,
    appearance = 'normal',
    hoverable = true,
    disablePopover = false,
    disableAvatar = false,
    avatarSize = 36,
    css,
  } = props;

  // TODO: return skeleton state when loading/not present
  if (!user) {
    return <UserTagContainer appearance={appearance}></UserTagContainer>;
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
          <UserTagContainer appearance={appearance} hoverable={hoverable}>
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
          </UserTagContainer>
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
