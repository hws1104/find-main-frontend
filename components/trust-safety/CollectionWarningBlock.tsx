import { cond, equals, always, T } from 'ramda';

import { ModerationStatus } from 'types/Moderation';
import { CollectionFragment } from 'graphql/hasura/hasura-fragments.generated';

import Page from 'components/Page';
import WarningBlock from './WarningBlock';
import WarningTermsLink from './WarningTermsLink';

interface CollectionWarningBlockProps {
  collection: Pick<CollectionFragment, 'moderationStatus'>;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function CollectionWarningBlock(
  props: CollectionWarningBlockProps
) {
  const { collection } = props;

  return cond<ModerationStatus, JSX.Element>([
    [
      (status) => equals(ModerationStatus.Suspended, status),
      always(
        <Page title="Collection Suspended">
          <CollectionSuspended />
        </Page>
      ),
    ],
    [
      (status) => equals(ModerationStatus.UnderReview, status),
      always(
        <Page title="Collection Under Review">
          <CollectionUnderReview />
        </Page>
      ),
    ],
    [T, () => null],
  ])(collection.moderationStatus);
}

function CollectionSuspended(): JSX.Element {
  return (
    <WarningBlock
      title="This collection has been permanently removed."
      description={
        <>
          This collection was found to be in violation of the Foundation{' '}
          <WarningTermsLink /> and has been permanently removed.
        </>
      }
      icon={ModerationStatus.Suspended}
    />
  );
}

function CollectionUnderReview(): JSX.Element {
  return (
    <WarningBlock
      title="This collection is under review"
      description={
        <>
          This collection is currently under review by the Foundation team to
          ensure it has not violated the Foundation <WarningTermsLink />.
        </>
      }
      icon={ModerationStatus.UnderReview}
    />
  );
}
