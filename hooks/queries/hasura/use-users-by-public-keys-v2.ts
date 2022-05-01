import { UseQueryOptions } from 'react-query';
import { map, propOr } from 'ramda';

import {
  useUsersByPublicKeys as useUsersByPublicKeysBaseHook,
  UsersByPublicKeys,
  UsersByPublicKeysVariables,
} from 'graphql/hasura/queries/users-by-public-keys.generated';

import { notEmptyOrNil } from 'utils/helpers';
import { maybeGetAddress } from 'utils/users';
import { ArtworkEvent } from 'types/Event';
import { getPublicKeysFromHistoryEvents } from 'queries/users-v2';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUsersByPublicKeys(
  variables: UsersByPublicKeysVariables,
  options?: UseQueryOptions<UsersByPublicKeys, Error>
) {
  const { publicKeys } = variables;
  return useUsersByPublicKeysBaseHook(
    { publicKeys: map(maybeGetAddress, publicKeys) },
    options
  );
}

interface UsersFromHistoryEventsVariables {
  events: ArtworkEvent[];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useUsersFromHistoryEvents(
  variables: UsersFromHistoryEventsVariables,
  options?: UseQueryOptions<UsersByPublicKeys, Error>
) {
  const events = propOr<
    [],
    UsersFromHistoryEventsVariables,
    UsersFromHistoryEventsVariables['events']
  >([], 'events', variables);

  return useUsersByPublicKeys(
    { publicKeys: getPublicKeysFromHistoryEvents(events) },
    {
      ...options,
      enabled: notEmptyOrNil(events),
      initialData: {
        users: [],
      },
    }
  );
}
