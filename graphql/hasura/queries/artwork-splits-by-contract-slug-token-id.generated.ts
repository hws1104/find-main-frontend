import * as Types from '../types-hasura.generated';

import { SplitRecipientFragment, UserFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkSplitsByContractSlugTokenIdVariables = Types.Exact<{
  tokenId: Types.Scalars['Int'];
  contractSlug: Types.Scalars['citext'];
}>;


export type ArtworkSplitsByContractSlugTokenId = { artworkSplits: Array<(
    { user: UserFragment }
    & SplitRecipientFragment
  )> };


export const ArtworkSplitsByContractSlugTokenIdDocument = /*#__PURE__*/ `
    query ArtworkSplitsByContractSlugTokenId($tokenId: Int!, $contractSlug: citext!) {
  artworkSplits: split_recipient(
    where: {artworks: {tokenId: {_eq: $tokenId}, collection: {slug: {_eq: $contractSlug}}}}
    order_by: {indexOfShare: asc}
  ) {
    ...SplitRecipientFragment
    user {
      ...UserFragment
    }
  }
}
    ${SplitRecipientFragment}
${UserFragment}`;
export const useArtworkSplitsByContractSlugTokenId = <
      TData = ArtworkSplitsByContractSlugTokenId,
      TError = Error
    >(
      variables: ArtworkSplitsByContractSlugTokenIdVariables, 
      options?: UseQueryOptions<ArtworkSplitsByContractSlugTokenId, TError, TData>
    ) => 
    useQuery<ArtworkSplitsByContractSlugTokenId, TError, TData>(
      ['ArtworkSplitsByContractSlugTokenId', variables],
      hasuraFetcher<ArtworkSplitsByContractSlugTokenId, ArtworkSplitsByContractSlugTokenIdVariables>(ArtworkSplitsByContractSlugTokenIdDocument, variables),
      options
    );
useArtworkSplitsByContractSlugTokenId.getKey = (variables: ArtworkSplitsByContractSlugTokenIdVariables) => ['ArtworkSplitsByContractSlugTokenId', variables];
