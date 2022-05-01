/* eslint-disable react/jsx-max-depth */
import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardMetaRelistButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';
import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import UserTagInline from 'components/users/UserTagInline';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaTransferred(
  props: ArtworkMetaProps
): JSX.Element {
  const { artwork, isOwnerOnProfile, auction } = props;

  const lastSalePrice =
    auction?.highestBidAmount ??
    auction?.reservePriceInETH ??
    artwork?.lastSalePriceInETH;

  if (!isOwnerOnProfile && lastSalePrice) {
    return (
      <ArtworkCardMetaContainer>
        <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
          <ArtworkCardMetaLabel color="light">
            Last sold for
          </ArtworkCardMetaLabel>
          <ArtworkCardMetaLabel color="light">
            {formatETHWithSuffix(lastSalePrice)}
          </ArtworkCardMetaLabel>
        </ArtworkCardMetaBlock>

        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Owned by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox css={{ display: 'block' }}>
            <UserTagInline user={artwork?.owner} avatarSize={22} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      </ArtworkCardMetaContainer>
    );
  }

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock>
        <ArtworkCardMetaLabel color="light">Owned by</ArtworkCardMetaLabel>
        <TopSurfaceBox css={{ display: 'block' }}>
          <UserTagInline user={artwork?.owner} avatarSize={22} />
        </TopSurfaceBox>
      </ArtworkCardMetaBlock>
      {isOwnerOnProfile && (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7', flexGrow: 1 }}>
          <TopSurfaceBox>
            <ArtworkCardMetaRelistButton artwork={artwork} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}
