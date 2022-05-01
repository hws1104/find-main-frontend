import * as Types from '../types-hasura.generated';

import { LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkActivityVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
  currentUserPublicKey: Types.Scalars['String'];
  tokenId: Types.Scalars['Int'];
}>;


export type ArtworkActivity = { artworks: Array<(
    Pick<Types.Artwork, 'id'>
    & LatestArtworkEventFragment
    & ArtworkSplitRecipientsFragment
  )>, auctions: Array<(
    { bids: Array<BidFragment> }
    & AuctionFragment
  )>, highestBidAuctions: Array<AuctionFragment> };


export const ArtworkActivityDocument = /*#__PURE__*/ `
    query ArtworkActivity($contractSlug: citext!, $currentUserPublicKey: String!, $tokenId: Int!) {
  artworks: artwork(
    where: {tokenId: {_eq: $tokenId}, isIndexed: {_eq: true}, collection: {slug: {_eq: $contractSlug}}}
  ) {
    id
    ...LatestArtworkEventFragment
    ...ArtworkSplitRecipientsFragment
  }
  auctions: auction(
    limit: 1
    order_by: {endsAt: desc_nulls_first}
    where: {status: {_in: ["OPEN", "FINALIZED", "ENDED"]}, artwork: {collection: {slug: {_eq: $contractSlug}}, tokenId: {_eq: $tokenId}}}
  ) {
    ...AuctionFragment
    bids(order_by: {bidAmount: desc_nulls_last}) {
      ...BidFragment
    }
  }
  highestBidAuctions: auction(
    limit: 1
    order_by: {endsAt: desc_nulls_last}
    where: {status: {_in: ["OPEN", "ENDED"]}, highestBidder: {_eq: $currentUserPublicKey}, artwork: {collection: {slug: {_eq: $contractSlug}}, tokenId: {_eq: $tokenId}}}
  ) {
    ...AuctionFragment
  }
}
    ${LatestArtworkEventFragment}
${ArtworkSplitRecipientsFragment}
${AuctionFragment}
${BidFragment}`;
export const useArtworkActivity = <
      TData = ArtworkActivity,
      TError = Error
    >(
      variables: ArtworkActivityVariables, 
      options?: UseQueryOptions<ArtworkActivity, TError, TData>
    ) => 
    useQuery<ArtworkActivity, TError, TData>(
      ['ArtworkActivity', variables],
      hasuraFetcher<ArtworkActivity, ArtworkActivityVariables>(ArtworkActivityDocument, variables),
      options
    );
useArtworkActivity.getKey = (variables: ArtworkActivityVariables) => ['ArtworkActivity', variables];
