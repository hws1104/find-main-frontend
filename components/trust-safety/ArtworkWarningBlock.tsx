import { cond, equals, always, T } from 'ramda';

import { ModerationStatus } from 'types/Moderation';

import DMCANotice from './DMCANotice';
import Artwork from 'types/Artwork';
import WarningBlock from './WarningBlock';
import WarningTermsLink from './WarningTermsLink';

interface ArtworkWarningBlockProps {
  artwork: Pick<Artwork, 'moderationStatus' | 'moderationFrom'>;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ArtworkWarningBlock(props: ArtworkWarningBlockProps) {
  const { artwork } = props;

  return cond<ModerationStatus, JSX.Element>([
    [
      (status) => equals(ModerationStatus.Suspended, status),
      always(<ArtworkSuspended />),
    ],
    [
      (status) => equals(ModerationStatus.UnderReview, status),
      always(<ArtworkUnderReview />),
    ],
    [
      (status) => equals(ModerationStatus.TakedownRequested, status),
      () => (
        <DMCANotice
          moderationFrom={artwork.moderationFrom}
          title="This artwork has received a DMCA takedown notice."
        />
      ),
    ],
    [T, () => null],
  ])(artwork.moderationStatus);
}

export function ArtworkUnderReview(): JSX.Element {
  return (
    <WarningBlock
      title="This artwork is under review"
      description={
        <>
          This artwork is currently under review by the Foundation team to
          ensure it has not violated the Foundation <WarningTermsLink />.
        </>
      }
      icon={ModerationStatus.UnderReview}
    />
  );
}

export function ArtworkSuspended(): JSX.Element {
  return (
    <WarningBlock
      title="This artwork has been permanently removed."
      description={
        <>
          This artwork was found to be in violation of the Foundation{' '}
          <WarningTermsLink /> and has been permanently removed.
        </>
      }
      icon={ModerationStatus.Suspended}
    />
  );
}
