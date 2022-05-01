import { gql } from 'graphql-request';

import { fndServerClient } from 'lib/clients/graphql';
import { ModerationStatus } from 'types/Moderation';

export interface SetCollectionModerationProxyProps {
  id: string;
  moderationStatus: ModerationStatus;
  token: string;
  adminAddress: string;
  url: string;
}

export async function setCollectionModerationProxy({
  id,
  moderationStatus,
  token,
  adminAddress,
  url,
}: SetCollectionModerationProxyProps): Promise<{ done: boolean }> {
  const res = await fetch('/api/admin/moderate-collection', {
    method: 'POST',
    body: JSON.stringify({ id, moderationStatus, token, adminAddress, url }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('An error occurred at this endpoint');
}

interface SetCollectionModerationStatusProps {
  token: string;
  id: string;
  moderationStatus: ModerationStatus;
}

const SET_COLLECTION_MODERATION_STATUS = gql`
  mutation setCollectionModerationStatus(
    $id: String!
    $moderationStatus: UserModerationStatus!
  ) {
    updateCollectionModerationStatus(
      id: $id
      moderationStatus: $moderationStatus
    ) {
      moderationStatus
    }
  }
`;

export async function setCollectionModerationStatus({
  token,
  id,
  moderationStatus,
}: SetCollectionModerationStatusProps): Promise<{
  updateUserModerationStatus: { moderationStatus: ModerationStatus };
}> {
  const client = fndServerClient(token);
  return await client.request(SET_COLLECTION_MODERATION_STATUS, {
    id,
    moderationStatus,
  });
}
