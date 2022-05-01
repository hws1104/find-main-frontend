import { UseInfiniteQueryOptions, useInfiniteQuery } from 'react-query';

import { ClientError } from 'graphql-request';
import { formatISO, subDays } from 'date-fns';

import { fndHasuraClient } from 'lib/clients/graphql';
import { PUBLIC_FEED_PER_PAGE_COUNT } from 'lib/constants';

import { getNextPageParam } from 'utils/artwork/artwork';

import { QueryCacheKey } from 'types/Queries';

import {
  FollowedArtworkEvents,
  FollowedArtworkEventsDocument,
  FollowedArtworkEventsVariables,
} from 'graphql/hasura/queries/followed-artwork-events.generated';

interface UseFollowedArtworkEventsArgs {
  publicKey: string;
  eventsSince?: Date;
}

export type FollowedArtworkEvent = FollowedArtworkEvents['events'][0];

async function getFollowedArtworkEvents(
  variables: FollowedArtworkEventsVariables
) {
  const client = fndHasuraClient();
  const data = await client.request<
    FollowedArtworkEvents,
    FollowedArtworkEventsVariables
  >(FollowedArtworkEventsDocument, variables);

  return data?.events;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useFollowedArtworkEvents(
  variables: UseFollowedArtworkEventsArgs,
  options?: UseInfiniteQueryOptions<
    FollowedArtworkEvent[],
    ClientError,
    FollowedArtworkEvent[]
  >
) {
  // Gets the date - 30 days since current timestamp
  const defaultDateSince = subDays(new Date(), 30);
  const { publicKey, eventsSince = defaultDateSince } = variables;

  const formattedEventSince = formatISO(eventsSince);

  return useInfiniteQuery(
    [QueryCacheKey.FollowedArtworks, variables],
    ({ pageParam = 0 }) =>
      getFollowedArtworkEvents({
        publicKey,
        eventsSince: formattedEventSince,
        limit: PUBLIC_FEED_PER_PAGE_COUNT,
        offset: PUBLIC_FEED_PER_PAGE_COUNT * pageParam,
      }),
    {
      ...options,
      enabled: Boolean(publicKey),
      getNextPageParam,
      keepPreviousData: true,
    }
  );
}
