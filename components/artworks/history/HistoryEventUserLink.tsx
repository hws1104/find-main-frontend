import NextLink from 'next/link';

import Account from 'types/Account';

import { getUsernameOrAddressInfo, getUsernameOrAddress } from 'utils/helpers';

import Link from 'components/base/Link';
import FollowPopover from 'components/follows/FollowPopover';

interface HistoryEventUserLinkProps {
  user: Account;
}

export default function HistoryEventUserLink(
  props: HistoryEventUserLinkProps
): JSX.Element {
  const { user } = props;

  const { usernameOrAddress, isAddress } = getUsernameOrAddressInfo(user);

  return (
    <FollowPopover publicKey={user?.publicKey}>
      <NextLink
        passHref
        href={`/${getUsernameOrAddress(user)}`}
        prefetch={false}
      >
        <Link
          css={{
            fontFamily: isAddress ? '$mono' : '$body',
            fontWeight: isAddress ? 400 : 600,
            color: '$black60',
            fontSize: '$0',
            textDecoration: 'none',
            '@bp0': {
              fontSize: '$1',
            },
            transition: 'color $1 $ease',
            '@hover': {
              '&:hover': {
                color: '$black100',
              },
            },
          }}
        >
          {usernameOrAddress}
        </Link>
      </NextLink>
    </FollowPopover>
  );
}
