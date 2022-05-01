import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardMetaListButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';
import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import UserTagInline from 'components/users/UserTagInline';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaPrivateSale(
  props: ArtworkMetaProps
): JSX.Element {
  const { artwork, isOwnerOnProfile } = props;

  const mostRecentPrivateSale = artwork.privateSales
    .filter((p) => p.soldAt)
    .sort((a, b) => {
      return new Date(a.soldAt).getTime() - new Date(b.soldAt).getTime();
    });

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel color="light">Last sold for</ArtworkCardMetaLabel>
        <ArtworkCardMetaLabel color="light">
          {formatETHWithSuffix(mostRecentPrivateSale[0]?.price)}
        </ArtworkCardMetaLabel>
      </ArtworkCardMetaBlock>

      {isOwnerOnProfile ? (
        <TopSurfaceBox css={{ marginLeft: '$7', flex: 1 }}>
          <ArtworkCardMetaListButton artwork={artwork} isSecondary />
        </TopSurfaceBox>
      ) : (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Owned by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox css={{ display: 'block' }}>
            <UserTagInline user={artwork?.owner} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}
