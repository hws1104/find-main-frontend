import { UseQueryOptions } from 'react-query';
import { head } from 'ramda';

import {
  PrivateSaleByIpfsVariables,
  PrivateSaleByIpfs,
  usePrivateSaleByIpfs as usePrivateSaleByIpfsBaseHook,
} from 'graphql/hasura/queries/private-sale-by-ipfs.generated';
import { PrivateSaleFragment } from 'graphql/hasura/hasura-fragments.generated';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function usePrivateSaleByIpfs(
  variables: PrivateSaleByIpfsVariables,
  options?: UseQueryOptions<PrivateSaleByIpfs, Error, PrivateSaleFragment>
) {
  return usePrivateSaleByIpfsBaseHook(variables, {
    select: (res) => head(res.privateSale),
    enabled: Boolean(variables.ipfsHash),
    ...options,
  });
}
