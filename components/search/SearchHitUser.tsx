import Grid from 'components/base/Grid';
import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultSubheading from './search-result/SearchResultSubheading';
import SearchResultLink from './search-result/SearchResultLink';
import Link from 'components/links/Link';
import { SquareAvatar } from 'components/base/Avatar';

import type { AlgoliaUser } from 'types/Algolia';
import type Account from 'types/Account';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { buildAvatarUrl } from 'utils/assets';

interface SearchHitUserProps {
  hit: AlgoliaUser;
  onClick: (arg0: AlgoliaUser) => void;
}

export default function SearchHitUser(props: SearchHitUserProps): JSX.Element {
  const { hit, onClick } = props;

  const user: Account = {
    publicKey: hit.publicKey,
    username: hit.username,
    name: hit.name,
  };

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const userHasUsername = hasUsername(hit);
  const userFullName = hit.name;

  return (
    <Link href={buildUserProfilePath({ user })}>
      <SearchResultLink as="a" onClick={() => onClick(hit)}>
        <SquareAvatar
          imageUrl={buildAvatarUrl(64, hit.profileImageUrl)}
          css={{ marginRight: '$4' }}
          size={48}
          shape="round"
        />

        <Grid css={{ alignItems: 'center', gap: '$1' }}>
          {userFullName && (
            <SearchResultHeading size={{ '@bp3': 2 }}>
              {hit.name}
            </SearchResultHeading>
          )}
          <SearchResultSubheading isMono={!userHasUsername}>
            {usernameOrTruncatedAddress}
          </SearchResultSubheading>
        </Grid>
      </SearchResultLink>
    </Link>
  );
}
