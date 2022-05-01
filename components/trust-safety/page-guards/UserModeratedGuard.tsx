import { TransactionActionButton } from 'components/transactions/generic/TransactionActionButtons';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';
import Box from 'components/base/Box';

import { ModerationStatus } from 'types/Moderation';

import {
  getUserModerationDescription,
  getUserModerationTitle,
} from 'utils/moderation';

interface UserModeratedGuardProps {
  userModerationStatus: ModerationStatus;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function UserModeratedGuard(props: UserModeratedGuardProps) {
  const { userModerationStatus } = props;
  return (
    <TransactionProgressPane
      key="user-moderated"
      status="warning"
      title={getUserModerationTitle(userModerationStatus)}
      description={getUserModerationDescription(userModerationStatus)}
      meta={
        <Box css={{ width: '100%' }}>
          <TransactionActionButton href="/" label="Continue" />
        </Box>
      }
    />
  );
}
