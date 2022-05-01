import * as Types from '../types-hasura.generated';

import { CollectionFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionByContractAddressVariables = Types.Exact<{
  contractAddress: Types.Scalars['String'];
}>;


export type CollectionByContractAddress = { collections: Array<CollectionFragmentExtended> };


export const CollectionByContractAddressDocument = /*#__PURE__*/ `
    query CollectionByContractAddress($contractAddress: String!) {
  collections: collection(where: {contractAddress: {_eq: $contractAddress}}) {
    ...CollectionFragmentExtended
  }
}
    ${CollectionFragmentExtended}`;
export const useCollectionByContractAddress = <
      TData = CollectionByContractAddress,
      TError = Error
    >(
      variables: CollectionByContractAddressVariables, 
      options?: UseQueryOptions<CollectionByContractAddress, TError, TData>
    ) => 
    useQuery<CollectionByContractAddress, TError, TData>(
      ['CollectionByContractAddress', variables],
      hasuraFetcher<CollectionByContractAddress, CollectionByContractAddressVariables>(CollectionByContractAddressDocument, variables),
      options
    );
useCollectionByContractAddress.getKey = (variables: CollectionByContractAddressVariables) => ['CollectionByContractAddress', variables];
