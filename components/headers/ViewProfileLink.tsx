/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import NextLink from 'next/link';

import Account from 'types/Account';

import RightChevron from 'assets/icons/right-chevron.svg';

import CircleAvatar from 'components/avatars/CircleAvatar';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';

import { getUsernameOrAddress } from 'utils/helpers';

interface ViewProfileLinkProps {
  avatarUrl?: string;
  className?: string;
  user: Account;
}

export default function ViewProfileLink(
  props: ViewProfileLinkProps
): JSX.Element {
  const { avatarUrl, user } = props;

  const profileHref = `/${getUsernameOrAddress(user)}`;

  return (
    <Box>
      <NextLink href={profileHref} passHref>
        <Link>
          <Flex css={{ alignItems: 'center' }}>
            <Flex className="label">
              <CircleAvatar
                maxSize={44}
                css={{ width: 44, height: 44 }}
                publicKey={user?.publicKey}
                imageUrl={avatarUrl}
              />
              <Flex
                css={{ flex: 'auto', marginLeft: '$4', alignItems: 'center' }}
              >
                <Heading size={2}>View Your Profile</Heading>
              </Flex>
            </Flex>
            <Box css={{ marginLeft: 'auto' }}>
              <RightChevron style={{ display: 'block' }} />
            </Box>
          </Flex>
        </Link>
      </NextLink>
    </Box>
  );
}

const Link = styled('a', {
  display: 'block',
  padding: '$4',
  color: '$black100',
  textDecoration: 'none',
  transition: 'background $1 $ease',
  borderRadius: '$1',
  '@hover': {
    '&:hover': {
      background: '$black5',
    },
  },
});
