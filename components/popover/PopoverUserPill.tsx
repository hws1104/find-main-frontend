import Link from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import FollowPopover from 'components/follows/FollowPopover';
import UserTagV2 from 'components/users/UserTagV2';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';
import UserTagRaw from 'components/users/UserTagRaw';

interface PopoverUserPillProps {
  user: Pick<UserFragment, 'publicKey' | 'username' | 'userIndex' | 'name'>;
  publicKey: string;
  type?: 'contained' | 'uncontained';
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function PopoverUserPill(props: PopoverUserPillProps) {
  const { user, publicKey, type = 'contained' } = props;
  return (
    <Flex>
      <FollowPopover publicKey={publicKey}>
        <Link href={buildUserProfilePath({ user })} passHref prefetch={false}>
          <Box as="a" css={{ textDecoration: 'none', color: '$black100' }}>
            {type === 'contained' ? (
              <UserTagV2 user={user} isLoading={false} hoverable />
            ) : (
              <UserTagRaw user={user} />
            )}
          </Box>
        </Link>
      </FollowPopover>
    </Flex>
  );
}
