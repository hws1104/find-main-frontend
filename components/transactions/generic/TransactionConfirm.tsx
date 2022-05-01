import TransactionContainerV2 from 'components/transactions/TransactionContainerV2';
import TransactionAwaitingConfirmation from 'components/transactions/TransactionAwaitingConfirmation';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface TransactionConfirmProps {
  artwork: ArtworkFragmentExtended;
}

export default function TransactionConfirm(
  props: TransactionConfirmProps
): JSX.Element {
  const { artwork } = props;

  return (
    <TransactionContainerV2 artwork={artwork}>
      <TransactionAwaitingConfirmation />
    </TransactionContainerV2>
  );
}
