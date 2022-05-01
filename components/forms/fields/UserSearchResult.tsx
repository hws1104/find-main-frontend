import { styled } from 'stitches.config';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';
import Link from 'next/link';

import HoverableIcon from 'components/HoverableIcon';
import Icon from 'components/Icon';

import RemoveIcon from 'assets/icons/remove-icon.svg';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import CircleAvatar from 'components/avatars/CircleAvatar';
import {
  getUsernameOrTruncatedAddress,
  hasUsername,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import Text from 'components/base/Text';
import Account from 'types/Account';
import FollowPopover from 'components/follows/FollowPopover';

const UserTagContainer = styled(Flex, {
  boxShadow: '$0',
  borderRadius: '$1',
  alignItems: 'center',
  willChange: 'transform',
  transition: 'box-shadow $1 $ease, transform $1 $ease',
  '@hover': {
    '&:hover': {
      boxShadow: '$1',
      transform: 'translateY(-2px)',
    },
  },
});

const UserHeading = styled(Heading, {
  fontSize: '$2',
  fontWeight: 'bold',
  display: 'flex',
  color: '$black100',
  fontFamily: '$body',
  variants: {
    size: {
      large: {
        fontSize: '$3',
      },
    },
    color: {
      isDark: {
        color: '$white100',
      },
    },
  },
});

const UserTagLink = styled('a', {
  color: 'currentColor',
  textDecoration: 'none',
  width: '100%',
  paddingY: '$5',
  paddingX: '$5',
});

const RemoveActionContainer = styled(Box, {
  position: 'absolute',
  top: '50%',
  right: '$5',
  transform: 'translateY(-50%)',
});

interface UserSearchResultProps {
  user: Account;
  onRemove: () => void;
}

export default function UserSearchResult(
  props: UserSearchResultProps
): JSX.Element {
  const { user, onRemove } = props;

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const userHasUsername = hasUsername(user);
  const userFullName = user.name;

  return (
    <UserTagContainer>
      <Link href={buildUserProfilePath({ user })} passHref>
        <UserTagLink target="_blank" rel="noreferrer">
          <FollowPopover publicKey={publicKeyOrIdOrAddress(user)}>
            <Flex css={{ alignItems: 'center' }}>
              <CircleAvatar
                publicKey={user?.publicKey}
                imageUrl={user?.profileImageUrl}
                maxSize={40}
                css={{ width: 40, height: 40 }}
              />
              <Flex
                css={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingLeft: '$3',
                }}
              >
                {userFullName && (
                  <UserHeading tracking="tight" leading="tight">
                    {userFullName}
                  </UserHeading>
                )}
                <Heading
                  tracking="tight"
                  leading="tight"
                  css={{
                    display: 'flex',
                    color: '$black100',
                    fontFamily: !userHasUsername ? '$mono' : '$body',
                    fontWeight: !userHasUsername ? 'normal' : 'bold',
                  }}
                >
                  <Text color={!userHasUsername ? null : 'rainbow'}>
                    {usernameOrTruncatedAddress}
                  </Text>
                </Heading>
              </Flex>
            </Flex>
          </FollowPopover>
        </UserTagLink>
      </Link>

      <RemoveActionContainer>
        <HoverableIcon
          css={{
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
          onClick={onRemove}
        >
          <Icon icon={RemoveIcon} width={10} height={10} />
        </HoverableIcon>
      </RemoveActionContainer>
    </UserTagContainer>
  );
}
