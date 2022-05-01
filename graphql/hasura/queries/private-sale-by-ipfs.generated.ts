import * as Types from '../types-hasura.generated';

import { PrivateSaleFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type PrivateSaleByIpfsVariables = Types.Exact<{
  ipfsHash: Types.Scalars['String'];
}>;


export type PrivateSaleByIpfs = { privateSale: Array<PrivateSaleFragment> };


export const PrivateSaleByIpfsDocument = /*#__PURE__*/ `
    query PrivateSaleByIpfs($ipfsHash: String!) {
  privateSale: private_sale(where: {ipfsPath: {_eq: $ipfsHash}}) {
    ...PrivateSaleFragment
  }
}
    ${PrivateSaleFragment}`;
export const usePrivateSaleByIpfs = <
      TData = PrivateSaleByIpfs,
      TError = Error
    >(
      variables: PrivateSaleByIpfsVariables, 
      options?: UseQueryOptions<PrivateSaleByIpfs, TError, TData>
    ) => 
    useQuery<PrivateSaleByIpfs, TError, TData>(
      ['PrivateSaleByIpfs', variables],
      hasuraFetcher<PrivateSaleByIpfs, PrivateSaleByIpfsVariables>(PrivateSaleByIpfsDocument, variables),
      options
    );
usePrivateSaleByIpfs.getKey = (variables: PrivateSaleByIpfsVariables) => ['PrivateSaleByIpfs', variables];
