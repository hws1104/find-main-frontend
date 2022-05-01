import Box from 'components/base/Box';

import TransactionSuccessLink from '../TransactionSuccessLink';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import Account from 'types/Account';

interface SettleCreatorActionProps {
  user: Account;
}

export default function SettleCreatorAction(
  props: SettleCreatorActionProps
): JSX.Element {
  const { user } = props;
  return (
    <Box
      css={{
        width: '100%',
        '@bp1': { maxWidth: 280 },
      }}
    >
      <TransactionSuccessLink href={buildUserProfilePath({ user })}>
        View profile
      </TransactionSuccessLink>
    </Box>
  );
}
