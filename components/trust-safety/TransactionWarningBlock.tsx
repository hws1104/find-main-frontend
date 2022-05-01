import { cond, equals, always } from 'ramda';

import { ModerationStatus } from 'types/Moderation';

import Box from 'components/base/Box';
import WarningBlock from './WarningBlock';
import WarningTermsLink from './WarningTermsLink';

interface TransactionWarningBlockProps {
  moderationStatus: ModerationStatus;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionWarningBlock(
  props: TransactionWarningBlockProps
) {
  const { moderationStatus } = props;

  return cond<ModerationStatus, JSX.Element>([
    [
      (status) => equals(ModerationStatus.Suspended, status),
      always(
        <WarningBlock
          title="Your profile has been permanently removed."
          description={
            <Box>
              Your profile has been found to be in violation of the Foundation
              <WarningTermsLink /> and permanently suspended. You can no longer
              mint any new NFTs.
            </Box>
          }
          icon={ModerationStatus.Suspended}
        />
      ),
    ],
    [
      (status) => equals(ModerationStatus.UnderReview, status),
      always(
        <WarningBlock
          title="Your profile is under review."
          description={
            <Box>
              Your profile is currently under review by the Foundation team, to
              ensure it has not broken the Foundation <WarningTermsLink />. You
              will not be able to mint any new NFTs at this time.
            </Box>
          }
          icon={ModerationStatus.UnderReview}
        />
      ),
    ],
  ])(moderationStatus);
}
