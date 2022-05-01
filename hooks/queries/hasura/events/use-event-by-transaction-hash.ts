import { UseQueryOptions } from 'react-query';

import {
  useEventByTransactionHash as useEventByTransactionHashBaseHook,
  EventByTransactionHash,
  EventByTransactionHashVariables,
} from 'graphql/hasura/queries/event-by-transaction-hash.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';

type BasicArtworkEvent = EventByTransactionHash['events'][0];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useEventByTransactionHash(
  variables: EventByTransactionHashVariables,
  options?: UseQueryOptions<EventByTransactionHash, Error, BasicArtworkEvent>
) {
  const { transactionHash } = variables;

  return useEventByTransactionHashBaseHook(
    { transactionHash: `${transactionHash}%` },
    {
      select: (res) => getFirstValue(res.events),
      enabled: isAllTrue([transactionHash]),
      refetchInterval: 5000,
      ...options,
    }
  );
}
