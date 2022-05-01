import * as Types from '../types-hasura.generated';

import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserOneTimeActionsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  actionType: Types.Scalars['String'];
}>;


export type UserOneTimeActions = { oneTimeActions: Array<Pick<Types.One_Time_Action, 'createdAt'>> };


export const UserOneTimeActionsDocument = /*#__PURE__*/ `
    query UserOneTimeActions($publicKey: String!, $actionType: String!) {
  oneTimeActions: one_time_action(
    where: {publicKey: {_eq: $publicKey}, actionType: {_eq: $actionType}}
  ) {
    createdAt
  }
}
    `;
export const useUserOneTimeActions = <
      TData = UserOneTimeActions,
      TError = Error
    >(
      variables: UserOneTimeActionsVariables, 
      options?: UseQueryOptions<UserOneTimeActions, TError, TData>
    ) => 
    useQuery<UserOneTimeActions, TError, TData>(
      ['UserOneTimeActions', variables],
      hasuraFetcher<UserOneTimeActions, UserOneTimeActionsVariables>(UserOneTimeActionsDocument, variables),
      options
    );
useUserOneTimeActions.getKey = (variables: UserOneTimeActionsVariables) => ['UserOneTimeActions', variables];
