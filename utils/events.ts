import { compose, cond, T, split, head, path } from 'ramda';

import { ArtworkEvent } from 'types/Event';

export const getTxHashFromId = compose<string, string[], string>(
  head,
  split('-')
);

export const getTransactionHash = cond<ArtworkEvent, string>([
  [
    (event: ArtworkEvent) => Boolean(event.data.transactionHash),
    path(['data', 'transactionHash']),
  ],
  [T, (event) => getTxHashFromId(event.id)],
]);
