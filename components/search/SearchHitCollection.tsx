import SearchResultHeading from './search-result/SearchResultHeading';
import SearchResultLink from './search-result/SearchResultLink';
import Grid from 'components/base/Grid';
import Link from 'components/links/Link';
import Mono from 'components/base/Mono';
import { SquareAvatar } from 'components/base/Avatar';

import type { AlgoliaCollection } from 'types/Algolia';

import { buildCollectionPath } from 'utils/collections';
import { buildAvatarUrl } from 'utils/assets';

interface SearchHitCollectionProps {
  hit: AlgoliaCollection;
  onClick: (arg0: AlgoliaCollection) => void;
}

export default function SearchHitCollection(
  props: SearchHitCollectionProps
): JSX.Element {
  const { hit, onClick } = props;

  // const imageUrl = ;

  return (
    <Link href={buildCollectionPath(hit)}>
      <SearchResultLink as="a" onClick={() => onClick(hit)}>
        <SquareAvatar
          imageUrl={buildAvatarUrl(64, hit.collectionImageUrl)}
          css={{ marginRight: '$4' }}
          size={48}
          shape={1}
        />
        <Grid css={{ alignItems: 'center', gap: '$1' }}>
          <SearchResultHeading size={{ '@bp3': 2 }}>
            {hit.name}
          </SearchResultHeading>
          <Mono css={{ color: '$black60' }} size={1}>
            {hit.symbol}
          </Mono>
        </Grid>
      </SearchResultLink>
    </Link>
  );
}
