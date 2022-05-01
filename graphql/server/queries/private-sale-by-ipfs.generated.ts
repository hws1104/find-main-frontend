import * as Types from '../types-server.generated';

import { PrivateSaleFragment } from '../server-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { useServerFetcher } from 'lib/clients/graphql';
export type SecurePrivateSaleByIpfsVariables = Types.Exact<{
  ipfsHash: Types.Scalars['String'];
}>;


export type SecurePrivateSaleByIpfs = { privateSale: PrivateSaleFragment };


export const SecurePrivateSaleByIpfsDocument = /*#__PURE__*/ `
    query SecurePrivateSaleByIpfs($ipfsHash: String!) {
  privateSale: privateSaleByIPFSPath(ipfsPath: $ipfsHash) {
    ...PrivateSaleFragment
  }
}
    ${PrivateSaleFragment}`;
export const useSecurePrivateSaleByIpfs = <
      TData = SecurePrivateSaleByIpfs,
      TError = Error
    >(
      variables: SecurePrivateSaleByIpfsVariables, 
      options?: UseQueryOptions<SecurePrivateSaleByIpfs, TError, TData>
    ) => 
    useQuery<SecurePrivateSaleByIpfs, TError, TData>(
      ['SecurePrivateSaleByIpfs', variables],
      useServerFetcher<SecurePrivateSaleByIpfs, SecurePrivateSaleByIpfsVariables>(SecurePrivateSaleByIpfsDocument).bind(null, variables),
      options
    );
useSecurePrivateSaleByIpfs.getKey = (variables: SecurePrivateSaleByIpfsVariables) => ['SecurePrivateSaleByIpfs', variables];
