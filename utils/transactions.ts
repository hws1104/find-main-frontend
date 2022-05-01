import { compose, not, includes, prop, when, anyPass } from 'ramda';

import { notEmptyOrNil } from './helpers';

export const isNonUserRejectedError = when(
  notEmptyOrNil,
  compose(
    not,
    anyPass([
      // no provider — pop modal open
      includes('No Provider Error'),
      // MetaMask Desktop
      includes('MetaMask Tx Signature: User denied transaction signature.'),
      // Rainbow WalletConnect
      includes('User rejected request'),
      // MetaMask WalletConnect
      includes('User rejected the transaction'),
    ]),
    prop('message')
  )
);
