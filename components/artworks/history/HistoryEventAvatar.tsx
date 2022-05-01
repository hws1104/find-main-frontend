import NextLink from 'next/link';
import { ComponentProps } from '@stitches/react';

import CircleAvatar from 'components/avatars/CircleAvatar';
import FollowPopover from 'components/follows/FollowPopover';
import Link from 'components/base/Link';
import Box from 'components/base/Box';

import { getUsernameOrAddress } from 'utils/helpers';

import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

type StitchesBoxProps = ComponentProps<typeof Box>;
interface HistoryEventAvatarProps {
  user: UserFragment;
  css?: StitchesBoxProps['css'];
}

export default function HistoryEventAvatar(
  props: HistoryEventAvatarProps
): JSX.Element {
  const { user, css } = props;

  // TODO: remove when we have user data
  if (!user) {
    return null;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box css={{ marginRight: '$4', ...css }}>
      <FollowPopover publicKey={user.publicKey}>
        <NextLink
          href={`/${getUsernameOrAddress(user)}`}
          prefetch={false}
          passHref
        >
          <Link css={{ textDecoration: 'none', display: 'block' }}>
            <CircleAvatar
              publicKey={user.publicKey}
              imageUrl={user.profileImageUrl}
              maxSize={36}
              css={{ width: 36, height: 36 }}
            />
          </Link>
        </NextLink>
      </FollowPopover>
    </Box>
  );
}
