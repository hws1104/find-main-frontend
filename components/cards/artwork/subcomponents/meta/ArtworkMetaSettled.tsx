import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import ArtworkCardMetaListButton from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaListButton';
import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';
import UserTagInline from 'components/users/UserTagInline';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaSettled(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction, artwork, isOwnerOnProfile } = props;

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel color="light">Last sold for</ArtworkCardMetaLabel>
        <ArtworkCardMetaLabel color="light">
          {formatETHWithSuffix(auction?.highestBidAmount)}
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
            <UserTagInline user={auction?.highestBidderUser} avatarSize={22} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}
