import { gql } from 'graphql-request';

import {
  UpsertUser,
  UpsertUserDocument,
  UpsertUserVariables,
} from 'graphql/server/mutations/upsert-user.generated';

import { fndServerClient } from 'lib/clients/graphql';

import { UserFragment } from 'queries/server/server-fragments';

import Account from 'types/Account';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function upsertUser(
  token: string,
  variables: UpsertUserVariables
) {
  const client = fndServerClient(token);
  return await client.request<UpsertUser, UpsertUserVariables>(
    UpsertUserDocument,
    variables
  );
}

const APPROVE_AS_CREATOR = gql`
  mutation approveAsCreator($data: ApproveUserInput!) {
    approveUserAsCreator(data: $data) {
      ...UserFragment
      email
    }
  }
  ${UserFragment}
`;

interface ApproveAsCreatorArgs {
  data: any;
  token: string;
}

export async function approveAsCreator({
  data,
  token,
}: ApproveAsCreatorArgs): Promise<{ approveAsCreator: Account }> {
  const client = fndServerClient(token);
  return await client.request(APPROVE_AS_CREATOR, {
    data,
  });
}
