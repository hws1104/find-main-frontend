import TransactionContent from '../TransactionContent';
import TransactionPendingState from '../TransactionPendingState';

import { ChangePriceTransactionProps } from './types';

export default function ChangePriceTransactionChangingPrice(
  props: Pick<ChangePriceTransactionProps, 'txHash'>
): JSX.Element {
  const { txHash } = props;

  return (
    <TransactionContent
      title="The reserve price is being changed."
      description="Your transaction has been submitted, and the reserve price for the artwork will be changed when the transaction is processed."
    >
      <TransactionPendingState txHash={txHash} />
    </TransactionContent>
  );
}
