import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkByUuidVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type ArtworkByUuid = { artwork?: Types.Maybe<ArtworkFragmentExtended> };


export const ArtworkByUuidDocument = /*#__PURE__*/ `
    query ArtworkByUUID($id: uuid!) {
  artwork: artwork_by_pk(id: $id) {
    ...ArtworkFragmentExtended
  }
}
    ${ArtworkFragmentExtended}`;
export const useArtworkByUuid = <
      TData = ArtworkByUuid,
      TError = Error
    >(
      variables: ArtworkByUuidVariables, 
      options?: UseQueryOptions<ArtworkByUuid, TError, TData>
    ) => 
    useQuery<ArtworkByUuid, TError, TData>(
      ['ArtworkByUUID', variables],
      hasuraFetcher<ArtworkByUuid, ArtworkByUuidVariables>(ArtworkByUuidDocument, variables),
      options
    );
useArtworkByUuid.getKey = (variables: ArtworkByUuidVariables) => ['ArtworkByUUID', variables];
