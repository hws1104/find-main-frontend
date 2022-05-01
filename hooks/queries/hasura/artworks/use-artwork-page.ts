import { UseQueryOptions } from 'react-query';

import {
  useArtworkPage as useArtworkPageBaseHook,
  ArtworkPageVariables,
  ArtworkPage,
} from 'graphql/hasura/queries/artwork-page.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';
import { isQueryEnabled } from 'hooks/queries/shared';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useArtworkPage(
  variables: ArtworkPageVariables,
  options?: UseQueryOptions<ArtworkPage, Error, ArtworkPage['artworks'][0]>
) {
  return useArtworkPageBaseHook(variables, {
    ...options,
    enabled: isAllTrue([isQueryEnabled(options), ...Object.values(variables)]),
    select: (res) => getFirstValue(res.artworks),
  });
}
