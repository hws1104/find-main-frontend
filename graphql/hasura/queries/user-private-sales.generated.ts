import * as Types from '../types-hasura.generated';

import { PrivateSaleFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserPrivateSalesVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
}>;


export type UserPrivateSales = { privateSalesSelling: Array<PrivateSaleFragment>, privateSalesBuying: Array<PrivateSaleFragment> };


export const UserPrivateSalesDocument = /*#__PURE__*/ `
    query UserPrivateSales($publicKey: String!, $currentDate: timestamp!) {
  privateSalesSelling: private_sale(
    where: {seller: {_eq: $publicKey}, deadlineAt: {_gt: $currentDate}, soldAt: {_is_null: true}}
    order_by: {deadlineAt: asc_nulls_last}
  ) {
    ...PrivateSaleFragment
  }
  privateSalesBuying: private_sale(
    where: {buyer: {_eq: $publicKey}, deadlineAt: {_gt: $currentDate}, soldAt: {_is_null: true}}
    order_by: {deadlineAt: asc_nulls_last}
  ) {
    ...PrivateSaleFragment
  }
}
    ${PrivateSaleFragment}`;
export const useUserPrivateSales = <
      TData = UserPrivateSales,
      TError = Error
    >(
      variables: UserPrivateSalesVariables, 
      options?: UseQueryOptions<UserPrivateSales, TError, TData>
    ) => 
    useQuery<UserPrivateSales, TError, TData>(
      ['UserPrivateSales', variables],
      hasuraFetcher<UserPrivateSales, UserPrivateSalesVariables>(UserPrivateSalesDocument, variables),
      options
    );
useUserPrivateSales.getKey = (variables: UserPrivateSalesVariables) => ['UserPrivateSales', variables];
