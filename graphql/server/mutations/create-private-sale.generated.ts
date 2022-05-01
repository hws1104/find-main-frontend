import * as Types from '../types-server.generated';

import { useMutation, UseMutationOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type CreatePrivateSaleVariables = Types.Exact<{
  data: Types.CreatePrivateSaleOffer;
}>;


export type CreatePrivateSale = { createPrivateSaleOffer: Pick<Types.PrivateSale, 'ipfsPath'> };


export const CreatePrivateSaleDocument = /*#__PURE__*/ `
    mutation CreatePrivateSale($data: CreatePrivateSaleOffer!) {
  createPrivateSaleOffer(data: $data) {
    ipfsPath
  }
}
    `;
export const useCreatePrivateSale = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePrivateSale, TError, CreatePrivateSaleVariables, TContext>) => 
    useMutation<CreatePrivateSale, TError, CreatePrivateSaleVariables, TContext>(
      useServerFetcher<CreatePrivateSale, CreatePrivateSaleVariables>(CreatePrivateSaleDocument),
      options
    );