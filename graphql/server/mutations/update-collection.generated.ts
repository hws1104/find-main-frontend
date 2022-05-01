import * as Types from '../types-server.generated';

import { CollectionFragment } from '../server-fragments.generated';
import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type UpdateCollectionVariables = Types.Exact<{
  data: Types.UpdateCollectionInput;
}>;


export type UpdateCollection = { updateCollection: CollectionFragment };


export const UpdateCollectionDocument = /*#__PURE__*/ `
    mutation UpdateCollection($data: UpdateCollectionInput!) {
  updateCollection(data: $data) {
    ...CollectionFragment
  }
}
    ${CollectionFragment}`;
export const useUpdateCollection = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCollection, TError, UpdateCollectionVariables, TContext>) => 
    useMutation<UpdateCollection, TError, UpdateCollectionVariables, TContext>(
      useServerFetcher<UpdateCollection, UpdateCollectionVariables>(UpdateCollectionDocument),
      options
    );