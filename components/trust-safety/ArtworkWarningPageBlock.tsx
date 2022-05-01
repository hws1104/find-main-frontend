import { cond, equals, always } from 'ramda';

import { ModerationStatus } from 'types/Moderation';
import { BasicArtwork } from 'types/Artwork';

import Page from 'components/Page';
import DMCANotice from './DMCANotice';
import { ArtworkSuspended, ArtworkUnderReview } from './ArtworkWarningBlock';

interface ArtworkWarningPageBlockProps {
  artwork: BasicArtwork;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ArtworkWarningPageBlock(
  props: ArtworkWarningPageBlockProps
) {
  const { artwork } = props;

  return cond<ModerationStatus, JSX.Element>([
    [
      (status) => equals(ModerationStatus.TakedownRequested, status),
      () => (
        <Page title="DMCA Takedown Notice">
          <DMCANotice
            moderationFrom={artwork.moderationFrom}
            title="This artwork has received a DMCA takedown notice."
          />
        </Page>
      ),
    ],
    [
      (status) => equals(ModerationStatus.Suspended, status),
      always(
        <Page title="Artwork Suspended">
          <ArtworkSuspended />
        </Page>
      ),
    ],
    [
      (status) => equals(ModerationStatus.UnderReview, status),
      always(
        <Page title="Artwork Under Review">
          <ArtworkUnderReview />
        </Page>
      ),
    ],
  ])(artwork.moderationStatus);
}
