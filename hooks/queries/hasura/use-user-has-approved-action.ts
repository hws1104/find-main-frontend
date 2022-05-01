import { UseQueryOptions } from 'react-query';

import {
  useUserOneTimeActions,
  UserOneTimeActions,
  UserOneTimeActionsVariables,
} from 'graphql/hasura/queries/user-one-time-actions.generated';

import { isAllTrue, notEmptyOrNil } from 'utils/helpers';
import { isQueryEnabled } from '../shared';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserHasApprovedAction(
  variables: UserOneTimeActionsVariables,
  options?: UseQueryOptions<UserOneTimeActions, Error, boolean>
) {
  return useUserOneTimeActions(variables, {
    ...options,
    select: (res) => notEmptyOrNil(res.oneTimeActions),
    enabled: isAllTrue([...Object.values(variables), isQueryEnabled(options)]),
  });
}
