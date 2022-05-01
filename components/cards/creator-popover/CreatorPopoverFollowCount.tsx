import NextLink from 'next/link';

import Link from 'components/base/Link';
import ProfileFollowCount from 'components/profiles/ProfileFollowCount';

import { getUsernameOrAddress } from 'utils/helpers';

import Account from 'types/Account';

interface CreatorPopoverFollowCountProps {
  user: Account;
  count: number;
  label: string;
}

export default function CreatorPopoverFollowCount(
  props: CreatorPopoverFollowCountProps
): JSX.Element {
  const { user, count, label } = props;
  return (
    <NextLink
      href={{
        pathname: `/${getUsernameOrAddress(user)}`,
        query: { follows: true },
      }}
      passHref
    >
      <Link
        css={{
          marginRight: '$4',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <ProfileFollowCount label={label} followerCount={count} />
      </Link>
    </NextLink>
  );
}
