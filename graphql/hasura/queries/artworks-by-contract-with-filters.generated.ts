import * as Types from '../types-hasura.generated';

import { ArtworkFragmentExtended } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworksByContractWithFiltersVariables = Types.Exact<{
  whereClause: Types.Artwork_Bool_Exp;
  orderClause?: Types.Maybe<Array<Types.Artwork_Order_By> | Types.Artwork_Order_By>;
  limit?: Types.Maybe<Types.Scalars['Int']>;
  offset?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type ArtworksByContractWithFilters = { artworks: Array<ArtworkFragmentExtended> };


export const ArtworksByContractWithFiltersDocument = /*#__PURE__*/ `
    query ArtworksByContractWithFilters($whereClause: artwork_bool_exp!, $orderClause: [artwork_order_by!], $limit: Int, $offset: Int) {
  artworks: artwork(
    where: $whereClause
    order_by: $orderClause
    limit: $limit
    offset: $offset
  ) {
    ...ArtworkFragmentExtended
  }
}
    ${ArtworkFragmentExtended}`;
export const useArtworksByContractWithFilters = <
      TData = ArtworksByContractWithFilters,
      TError = Error
    >(
      variables: ArtworksByContractWithFiltersVariables, 
      options?: UseQueryOptions<ArtworksByContractWithFilters, TError, TData>
    ) => 
    useQuery<ArtworksByContractWithFilters, TError, TData>(
      ['ArtworksByContractWithFilters', variables],
      hasuraFetcher<ArtworksByContractWithFilters, ArtworksByContractWithFiltersVariables>(ArtworksByContractWithFiltersDocument, variables),
      options
    );
useArtworksByContractWithFilters.getKey = (variables: ArtworksByContractWithFiltersVariables) => ['ArtworksByContractWithFilters', variables];
