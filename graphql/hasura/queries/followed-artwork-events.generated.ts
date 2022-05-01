import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type FollowedArtworkEventsVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  eventsSince: Types.Scalars['timestamp'];
  offset: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type FollowedArtworkEvents = { events: Array<(
    Pick<Types.Event, 'publicKey' | 'eventType' | 'data' | 'tokenId' | 'tokenCreator' | 'blockTimestamp'>
    & { user: Pick<Types.User, 'userIndex' | 'publicKey' | 'username' | 'profileImageUrl' | 'coverImageUrl' | 'name' | 'bio' | 'isApprovedCreator' | 'moderationStatus' | 'joinedWaitlistAt' | 'createdAt' | 'isApprovedForMigrationAt' | 'isAdmin' | 'links'>, artwork?: Types.Maybe<ArtworkFragmentExtended> }
  )> };


export const FollowedArtworkEventsDocument = /*#__PURE__*/ `
    query FollowedArtworkEvents($publicKey: String!, $eventsSince: timestamp!, $offset: Int!, $limit: Int!) {
  events: event(
    where: {blockTimestamp: {_gt: $eventsSince}, follower: {user: {_eq: $publicKey}, isFollowing: {_eq: true}}, artwork: {isIndexed: {_eq: true}}, eventType: {_nin: ["MIGRATE_CREATOR", "MIGRATE_CREATOR_PAYMENT_ADDRESS", "MIGRATE_OWNER", "MIGRATE_SELLER", "UNLIST", "SELL", "SETTLE", "TRANSFER", "PRIVATE_SALE"]}}
    order_by: {blockTimestamp: desc}
    limit: $limit
    offset: $offset
  ) {
    publicKey
    eventType
    data
    tokenId
    tokenCreator
    blockTimestamp
    user {
      userIndex
      publicKey
      username
      profileImageUrl
      coverImageUrl
      name
      bio
      isApprovedCreator
      moderationStatus
      joinedWaitlistAt
      createdAt
      isApprovedForMigrationAt
      isAdmin
      links
    }
    artwork {
      ...ArtworkFragmentExtended
    }
  }
}
    ${ArtworkFragmentExtended}`;
export const useFollowedArtworkEvents = <
      TData = FollowedArtworkEvents,
      TError = Error
    >(
      variables: FollowedArtworkEventsVariables, 
      options?: UseQueryOptions<FollowedArtworkEvents, TError, TData>
    ) => 
    useQuery<FollowedArtworkEvents, TError, TData>(
      ['FollowedArtworkEvents', variables],
      hasuraFetcher<FollowedArtworkEvents, FollowedArtworkEventsVariables>(FollowedArtworkEventsDocument, variables),
      options
    );
useFollowedArtworkEvents.getKey = (variables: FollowedArtworkEventsVariables) => ['FollowedArtworkEvents', variables];
