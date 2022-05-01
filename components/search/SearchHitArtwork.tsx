import Grid from 'components/base/Grid';

import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultSubheading from './search-result/SearchResultSubheading';
import SearchResultLink from './search-result/SearchResultLink';
import Link from 'components/links/Link';
import { SquareAvatar } from 'components/base/Avatar';

import { ArtworkAssetFields } from 'types/Artwork';
import type { AlgoliaArtwork } from 'types/Algolia';
import type Account from 'types/Account';

import { getUsernameOrTruncatedAddress, hasUsername } from 'utils/helpers';
import { buildAssetStaticImage } from 'utils/assets';
import { buildArtworkPath } from 'utils/artwork/artwork';

interface SearchHitArtworkProps {
  hit: AlgoliaArtwork;
  onClick: (arg0: AlgoliaArtwork) => void;
}

type SearchHitAssetFields = ArtworkAssetFields & {
  collection: {
    slug: string;
  };
};

export default function SearchHitArtwork(
  props: SearchHitArtworkProps
): JSX.Element {
  const { hit, onClick } = props;

  const user: Account = {
    publicKey: hit.creator.publicKey,
    username: hit.creator.username,
  };

  const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
  const userHasUsername = hasUsername(user);

  const asset: SearchHitAssetFields = {
    id: hit.id,
    tokenId: hit.tokenId,
    name: hit.name,
    assetIPFSPath: hit.assetIPFSPath,
    assetScheme: hit.assetScheme,
    assetHost: hit.assetHost,
    assetPath: hit.assetPath,
    assetId: hit.assetId,
    assetStatus: hit.assetStatus,
    mimeType: hit.mimeType,
    collection: { slug: hit.collection.slug },
  };

  const creator: Account = {
    publicKey: hit.creator.publicKey,
    username: hit.creator.username,
  };

  const assetPreviewUrl = buildAssetStaticImage({ w: 128, fm: 'jpg' }, asset);

  return (
    <Link href={buildArtworkPath({ artwork: asset, user: creator })}>
      <SearchResultLink as="a" onClick={() => onClick(hit)}>
        <SquareAvatar
          imageUrl={assetPreviewUrl}
          css={{ marginRight: '$4' }}
          size={48}
          shape={1}
        />
        <Grid css={{ alignItems: 'center', gap: '$1' }}>
          <SearchResultHeading size={{ '@bp3': 2 }}>
            {hit.name}
          </SearchResultHeading>
          <SearchResultSubheading isMono={!userHasUsername}>
            {usernameOrTruncatedAddress}
          </SearchResultSubheading>
        </Grid>
      </SearchResultLink>
    </Link>
  );
}
