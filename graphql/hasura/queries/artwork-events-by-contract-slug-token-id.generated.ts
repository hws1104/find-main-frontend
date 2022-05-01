import * as Types from '../types-hasura.generated';

import { ArtworkEventFragment, UserFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkEventsByContractSlugTokenIdVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
  tokenId: Types.Scalars['Int'];
}>;


export type ArtworkEventsByContractSlugTokenId = { events: Array<(
    { user: UserFragment }
    & ArtworkEventFragment
  )> };


export const ArtworkEventsByContractSlugTokenIdDocument = /*#__PURE__*/ `
    query ArtworkEventsByContractSlugTokenId($contractSlug: citext!, $tokenId: Int!) {
  events: event(
    order_by: {blockTimestamp: desc_nulls_last}
    where: {artwork: {tokenId: {_eq: $tokenId}, collection: {slug: {_eq: $contractSlug}}}, eventType: {_nin: ["MIGRATE_CREATOR", "MIGRATE_CREATOR_PAYMENT_ADDRESS", "MIGRATE_OWNER", "MIGRATE_SELLER"]}}
  ) {
    ...ArtworkEventFragment
    user {
      ...UserFragment
    }
  }
}
    ${ArtworkEventFragment}
${UserFragment}`;
export const useArtworkEventsByContractSlugTokenId = <
      TData = ArtworkEventsByContractSlugTokenId,
      TError = Error
    >(
      variables: ArtworkEventsByContractSlugTokenIdVariables, 
      options?: UseQueryOptions<ArtworkEventsByContractSlugTokenId, TError, TData>
    ) => 
    useQuery<ArtworkEventsByContractSlugTokenId, TError, TData>(
      ['ArtworkEventsByContractSlugTokenId', variables],
      hasuraFetcher<ArtworkEventsByContractSlugTokenId, ArtworkEventsByContractSlugTokenIdVariables>(ArtworkEventsByContractSlugTokenIdDocument, variables),
      options
    );
useArtworkEventsByContractSlugTokenId.getKey = (variables: ArtworkEventsByContractSlugTokenIdVariables) => ['ArtworkEventsByContractSlugTokenId', variables];
