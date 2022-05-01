import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateUserLastReadNotificationAtVariables = Types.Exact<{ [key: string]: never; }>;


export type UpdateUserLastReadNotificationAt = Pick<Types.Mutation, 'updateUserLastReadNotificationAt'>;


export const UpdateUserLastReadNotificationAtDocument = /*#__PURE__*/ `
    mutation UpdateUserLastReadNotificationAt {
  updateUserLastReadNotificationAt
}
    `;
export const useUpdateUserLastReadNotificationAt = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserLastReadNotificationAt, TError, UpdateUserLastReadNotificationAtVariables, TContext>) => 
    useMutation<UpdateUserLastReadNotificationAt, TError, UpdateUserLastReadNotificationAtVariables, TContext>(
      useServerFetcher<UpdateUserLastReadNotificationAt, UpdateUserLastReadNotificationAtVariables>(UpdateUserLastReadNotificationAtDocument),
      options
    );