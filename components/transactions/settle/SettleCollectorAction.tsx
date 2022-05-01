import Grid from 'components/base/Grid';

import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';
import TransactionSuccessLink from '../TransactionSuccessLink';

import { buildUserProfilePath } from 'utils/artwork/artwork';

import Account from 'types/Account';

interface SettleCollectorActionProps {
  user: Account;
  twitterShareText: string;
}

export default function SettleCollectorAction(
  props: SettleCollectorActionProps
): JSX.Element {
  const { user, twitterShareText } = props;
  return (
    <Grid
      css={{
        gap: 10,
        gridTemplateColumns: 'repeat(1, 1fr)',
        '@bp0': { gridTemplateColumns: 'repeat(2, 1fr)' },
      }}
    >
      <TwitterShareButtonLink twitterShareText={twitterShareText} />

      <TransactionSuccessLink
        href={buildUserProfilePath({
          user,
        })}
        variant="outline"
      >
        View profile
      </TransactionSuccessLink>
    </Grid>
  );
}
