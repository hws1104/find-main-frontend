/* eslint-disable max-lines */
import { gql } from 'graphql-request';
import { getAddress } from '@ethersproject/address';

import { getFirstValue, mapStrToCheckSum } from 'utils/helpers';

import { fndHasuraClient } from 'lib/clients/graphql';
import {
  HasuraFeedUserFragment,
  HasuraUserFragment,
  HasuraUserProfileFragment,
} from './hasura-fragments';

import {
  UserByPublicKey,
  UserByPublicKeyDocument,
  UserByPublicKeyVariables,
} from 'graphql/hasura/queries/user-by-public-key.generated';

import { AccountExtended, AccountFeed } from 'types/Account';
import { ModerationStatus } from 'types/Moderation';
import { HasuraUsersQueryArgs } from './types';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface UserData {
  user: UserFragment;
}

interface FeedUserData {
  users: AccountFeed[];
}

interface UsersData {
  users: UserFragment[];
}

interface ExtendedUserData {
  user: AccountExtended;
}

interface ExtendedUsersData {
  users: AccountExtended[];
}

// helper functions to build queries
export async function buildHasuraUserQuery<T>(
  publicKey: string,
  query: string
): Promise<T> {
  const client = fndHasuraClient();
  return await client.request<T>(query, {
    publicKey: getAddress(publicKey),
  });
}

export async function buildHasuraUsernameQuery<T>(
  username: string,
  query: string
): Promise<T> {
  const client = fndHasuraClient();
  return await client.request<T>(query, { username });
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getUserByPublicKey(variables: UserByPublicKeyVariables) {
  const client = fndHasuraClient();
  return await client.request<UserByPublicKey, UserByPublicKeyVariables>(
    UserByPublicKeyDocument,
    variables
  );
}

export const HASURA_USER_PROFILE_BY_PUBLIC_KEY_QUERY = gql`
  query hasuraUserProfileByPublicKey($publicKey: String!) {
    user: user_by_pk(publicKey: $publicKey) {
      ...HasuraUserProfileFragment
    }
  }
  ${HasuraUserProfileFragment}
`;

export async function getHasuraUserProfileByPublicKey(
  publicKey: string
): Promise<ExtendedUserData> {
  return await buildHasuraUserQuery<ExtendedUserData>(
    publicKey,
    HASURA_USER_PROFILE_BY_PUBLIC_KEY_QUERY
  );
}

export const HASURA_USER_PROFILE_BY_USERNAME_QUERY = gql`
  query hasuraUserProfileByUsername($username: citext!) {
    users: user(where: { username: { _eq: $username } }) {
      ...HasuraUserProfileFragment
    }
  }
  ${HasuraUserProfileFragment}
`;

export async function getHasuraUserProfileByUsername(
  username: string
): Promise<ExtendedUserData> {
  const { users } = await buildHasuraUsernameQuery<ExtendedUsersData>(
    username,
    HASURA_USER_PROFILE_BY_USERNAME_QUERY
  );
  return { user: getFirstValue(users) };
}

export const HASURA_USER_BY_USERNAME_QUERY = gql`
  query hasuraUserByUsername($username: citext!) {
    users: user(where: { username: { _eq: $username } }) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUserByUsername(
  username: string
): Promise<UserData> {
  const { users } = await buildHasuraUsernameQuery<UsersData>(
    username,
    HASURA_USER_BY_USERNAME_QUERY
  );
  return { user: getFirstValue(users) };
}

export const HASURA_USER_BY_USERNAMES_QUERY = gql`
  query hasuraUsersByUsernames($usernames: [citext!]!) {
    users: user(where: { username: { _in: $usernames } }) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUsersByUsernames(
  usernames: string[]
): Promise<UsersData> {
  const client = fndHasuraClient();
  return await client.request<UsersData>(HASURA_USER_BY_USERNAMES_QUERY, {
    usernames,
  });
}

export const HASURA_USERS_QUERY = gql`
  query hasuraUsersByIds(
    $publicKeys: [String!]!
    $moderationStatuses: [user_moderationstatus_enum!]
  ) {
    users: user(
      where: {
        publicKey: { _in: $publicKeys }
        moderationStatus: { _in: $moderationStatuses }
      }
    ) {
      ...HasuraUserFragment
    }
  }
  ${HasuraUserFragment}
`;

export async function getHasuraUsers({
  publicKeys,
  moderationStatuses = [ModerationStatus.Active],
}: HasuraUsersQueryArgs): Promise<UsersData> {
  const client = fndHasuraClient();
  return await client.request<UsersData>(HASURA_USERS_QUERY, {
    publicKeys: mapStrToCheckSum(publicKeys),
    moderationStatuses,
  });
}

export const HASURA_USERS_SEARCH_QUERY = gql`
  query userSearchQuery(
    $searchQuery: String!
    $offset: Int!
    $limit: Int!
    $moderationStatuses: [user_moderationstatus_enum!]
    $publicKey: String!
  ) {
    users: user(
      where: {
        # only search creators
        isApprovedCreator: { _eq: true }
        # exclude hidden creators
        hiddenAt: { _is_null: true }
        moderationStatus: { _in: $moderationStatuses }
        # search across both name and username
        _or: [
          { name: { _ilike: $searchQuery } }
          { username: { _ilike: $searchQuery } }
        ]
        artworks: { tokenId: { _is_null: false } }
      }
      # favour profiles that were created earlier and
      # that have important info filled out
      order_by: {
        userIndex: asc
        name: desc_nulls_last
        profileImageUrl: desc_nulls_last
        coverImageUrl: desc_nulls_last
      }
      offset: $offset
      limit: $limit
    ) {
      ...HasuraFeedUserFragment
    }
  }
  ${HasuraFeedUserFragment}
`;

// use find vs. get as it’s a search-like feature
export async function findHasuraUsers(
  searchQuery: string
): Promise<FeedUserData> {
  const client = fndHasuraClient();
  return await client.request<FeedUserData>(HASURA_USERS_SEARCH_QUERY, {
    // find all occurences containing the substring
    searchQuery: `%${searchQuery}%`,
    // limit statuses only to active
    moderationStatuses: [ModerationStatus.Active],
  });
}
