import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';

import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TransactionSuccessLink from 'components/transactions/TransactionSuccessLink';

import { ChangePriceTransactionProps } from 'components/transactions/changePrice/types';
import TransactionContent from '../TransactionContent';

interface ChangePriceTransactionSuccessProps
  extends ChangePriceTransactionProps {
  artworkPath: string;
  profilePath: string;
  isEventEmitted: boolean;
}

export default function ChangePriceTransactionSuccess(
  props: Omit<ChangePriceTransactionSuccessProps, 'artwork'>
): JSX.Element {
  const { txHash, artworkPath, profilePath, isEventEmitted } = props;

  const isPriceChanged = isEventEmitted;

  return (
    <TransactionContent
      title="Reserve price changed."
      description="The reserve price has been changed for your NFT."
    >
      <Grid
        css={{
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 10,
          '@bp0': { gridTemplateColumns: 'repeat(2, 1fr)' },
        }}
      >
        <TransactionSuccessLink href={artworkPath} isLoading={!isPriceChanged}>
          View artwork
        </TransactionSuccessLink>
        <TransactionSuccessLink
          href={profilePath}
          isLoading={!isPriceChanged}
          variant="outline"
        >
          View profile
        </TransactionSuccessLink>
      </Grid>

      <Flex
        css={{
          justifyContent: 'center',
          '@bp1': {
            justifyContent: 'flex-start',
          },
        }}
      >
        <TransactionHashLink txHash={txHash} />
      </Flex>
    </TransactionContent>
  );
}
