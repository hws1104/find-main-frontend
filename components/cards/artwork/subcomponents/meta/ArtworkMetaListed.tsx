import ArtworkCardMetaBlock, {
  TopSurfaceBox,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';
import UserTagInline from 'components/users/UserTagInline';
import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';

import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaListed(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction, artwork } = props;

  const isSecondarySale = auction?.isPrimarySale === false;

  return (
    <ArtworkCardMetaContainer>
      <ArtworkCardMetaBlock css={{ flexShrink: 0 }}>
        <ArtworkCardMetaLabel>Reserve price</ArtworkCardMetaLabel>
        <ArtworkCardMetaLabel>
          {formatETHWithSuffix(auction?.reservePriceInETH)}
        </ArtworkCardMetaLabel>
      </ArtworkCardMetaBlock>

      {isSecondarySale && (
        <ArtworkCardMetaBlock css={{ marginLeft: '$7' }}>
          <ArtworkCardMetaLabel color="light" css={{ textAlign: 'right' }}>
            Listed by
          </ArtworkCardMetaLabel>
          <TopSurfaceBox css={{ display: 'block' }}>
            <UserTagInline user={artwork?.owner} avatarSize={22} />
          </TopSurfaceBox>
        </ArtworkCardMetaBlock>
      )}
    </ArtworkCardMetaContainer>
  );
}
