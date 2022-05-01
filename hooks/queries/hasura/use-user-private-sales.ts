import { UseQueryOptions } from 'react-query';

import {
  useUserPrivateSales as useUserPrivateSalesBaseHook,
  UserPrivateSales,
  UserPrivateSalesVariables,
} from 'graphql/hasura/queries/user-private-sales.generated';

const currentDate = new Date().toISOString();

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserPrivateSales(
  variables: Pick<UserPrivateSalesVariables, 'publicKey'>,
  options?: UseQueryOptions<UserPrivateSales, Error>
) {
  const { publicKey } = variables;
  return useUserPrivateSalesBaseHook(
    { publicKey, currentDate },
    { enabled: Boolean(publicKey), ...options }
  );
}
