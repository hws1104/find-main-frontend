import { compose, flatten, isNil, map, paths, reject, uniq } from 'ramda';

import {
  UsersByPublicKeysVariables,
  UsersByPublicKeysDocument,
  UsersByPublicKeys,
} from 'graphql/hasura/queries/users-by-public-keys.generated';

import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress } from 'utils/users';
import { ArtworkEvent } from 'types/Event';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUsersByPublicKeys(
  variables: UsersByPublicKeysVariables
) {
  const { publicKeys } = variables;

  const client = fndHasuraClient();

  return await client.request<UsersByPublicKeys, UsersByPublicKeysVariables>(
    UsersByPublicKeysDocument,
    { publicKeys: map(maybeGetAddress, publicKeys) }
  );
}

export const getPublicKeysFromHistoryEvents = compose<
  ArtworkEvent[],
  string[][],
  string[],
  string[],
  string[]
>(
  reject(isNil),
  uniq,
  flatten,
  map<ArtworkEvent, string[]>(
    paths([
      ['data', 'fromAddress'],
      ['data', 'toAddress'],
    ])
  )
);

interface UsersFromHistoryEventsVariables {
  events: ArtworkEvent[];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUsersFromHistoryEvents(
  variables: UsersFromHistoryEventsVariables
) {
  const client = fndHasuraClient();

  const publicKeys = getPublicKeysFromHistoryEvents(variables.events);

  return await client.request<UsersByPublicKeys, UsersByPublicKeysVariables>(
    UsersByPublicKeysDocument,
    { publicKeys: map(maybeGetAddress, publicKeys) }
  );
}
