import ArtworkCardMetaButton from './ArtworkCardMetaButton';

import {
  buildArtworkListPath,
  hasActivePrivateSale,
} from 'utils/artwork/artwork';

import { ArtworkMetaProps } from './types';

type ArtworkCardMetaListButtonProps = Pick<ArtworkMetaProps, 'artwork'> & {
  isSecondary?: boolean;
};

export default function ArtworkCardMetaListButton(
  props: ArtworkCardMetaListButtonProps
): JSX.Element {
  const { artwork, isSecondary } = props;

  const hasPrivateSale = hasActivePrivateSale(artwork);

  return (
    <ArtworkCardMetaButton
      disabled={hasPrivateSale}
      href={buildArtworkListPath(
        artwork,
        isSecondary ? 'secondary' : 'primary'
      )}
    >
      List
    </ArtworkCardMetaButton>
  );
}
