import { UseQueryOptions } from 'react-query';
import { useRouter } from 'next/router';

import { getFirstValue, isAllTrue } from 'utils/helpers';
import {
  useArtworkByUuid as useArtworkByUuidBaseHook,
  ArtworkByUuid,
} from 'graphql/hasura/queries/artwork-by-uuid.generated';
import { isQueryEnabled } from 'hooks/queries/shared';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

useArtworkByUuidFromRouter.getKey = useArtworkByUuidBaseHook.getKey;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useArtworkByUuidFromRouter(
  options?: UseQueryOptions<ArtworkByUuid, Error, ArtworkFragmentExtended>
) {
  const router = useRouter();

  const artworkId = getFirstValue(router.query.id);

  return useArtworkByUuidBaseHook(
    { id: artworkId },
    {
      ...options,
      select: (res) => res.artwork,
      enabled: isAllTrue([artworkId, isQueryEnabled(options)]),
    }
  );
}
