import { cond, equals, always } from 'ramda';

import { ModerationStatus } from 'types/Moderation';

import Page from 'components/Page';
import WarningBlock from './WarningBlock';
import WarningTermsLink from './WarningTermsLink';

interface ProfileWarningBlockProps {
  moderationStatus: ModerationStatus;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ProfileWarningBlock(props: ProfileWarningBlockProps) {
  const { moderationStatus } = props;

  return cond<ModerationStatus, JSX.Element>([
    [
      (status) => equals(ModerationStatus.Suspended, status),
      always(
        <Page title="Profile Suspended">
          <ProfileSuspended />
        </Page>
      ),
    ],
    [
      (status) => equals(ModerationStatus.UnderReview, status),
      always(
        <Page title="Profile Under Review">
          <ProfileUnderReview />
        </Page>
      ),
    ],
  ])(moderationStatus);
}

function ProfileSuspended(): JSX.Element {
  return (
    <WarningBlock
      title="This profile has been permanently removed."
      description={
        <>
          This profile was found to be in violation of the Foundation{' '}
          <WarningTermsLink /> and has been permanently removed.
        </>
      }
      icon={ModerationStatus.Suspended}
    />
  );
}

function ProfileUnderReview(): JSX.Element {
  return (
    <WarningBlock
      title="This profile is under review."
      description={
        <>
          This profile is currently under review by the Foundation team to
          ensure it has not violated the Foundation <WarningTermsLink />.
        </>
      }
      icon={ModerationStatus.UnderReview}
    />
  );
}
