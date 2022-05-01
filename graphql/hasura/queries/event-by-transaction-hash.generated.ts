import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type EventByTransactionHashVariables = Types.Exact<{
  transactionHash: Types.Scalars['String'];
}>;


export type EventByTransactionHash = { events: Array<Pick<Types.Event, 'id' | 'eventType'>> };


export const EventByTransactionHashDocument = /*#__PURE__*/ `
    query EventByTransactionHash($transactionHash: String!) {
  events: event(where: {id: {_like: $transactionHash}}, limit: 1) {
    id
    eventType
  }
}
    `;
export const useEventByTransactionHash = <
      TData = EventByTransactionHash,
      TError = Error
    >(
      variables: EventByTransactionHashVariables, 
      options?: UseQueryOptions<EventByTransactionHash, TError, TData>
    ) => 
    useQuery<EventByTransactionHash, TError, TData>(
      ['EventByTransactionHash', variables],
      hasuraFetcher<EventByTransactionHash, EventByTransactionHashVariables>(EventByTransactionHashDocument, variables),
      options
    );
useEventByTransactionHash.getKey = (variables: EventByTransactionHashVariables) => ['EventByTransactionHash', variables];
