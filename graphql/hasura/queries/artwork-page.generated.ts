import * as Types from '../types-hasura.generated';

import { ArtworkFragment, UserFragment, CollectionFragment, LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment, MostRecentAuctionFragment, ArtworkEventFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type ArtworkPageVariables = Types.Exact<{
  contractSlug: Types.Scalars['citext'];
  tokenId: Types.Scalars['Int'];
}>;


export type ArtworkPage = { artworks: Array<(
    { owner?: Types.Maybe<UserFragment>, creator?: Types.Maybe<UserFragment>, collection?: Types.Maybe<(
      { creator: UserFragment }
      & CollectionFragment
    )>, splitRecipients: Array<(
      Pick<Types.Split_Recipient, 'id' | 'contractAddress' | 'indexOfShare' | 'publicKey' | 'sharePercent'>
      & { user: UserFragment }
    )>, otherArtworks?: Types.Maybe<(
      Pick<Types.User, 'bio'>
      & { artworks: Array<(
        { owner?: Types.Maybe<UserFragment>, creator?: Types.Maybe<UserFragment>, collection?: Types.Maybe<Pick<Types.Collection, 'symbol' | 'slug' | 'name' | 'collectionImageUrl' | 'contractAddress'>> }
        & ArtworkFragment
        & LatestArtworkEventFragment
        & ArtworkSplitRecipientsFragment
        & MostRecentAuctionFragment
      )>, artworksCount: { aggregate?: Types.Maybe<Pick<Types.Artwork_Aggregate_Fields, 'count'>> } }
    )>, collectionCoverImage?: Types.Maybe<Pick<Types.Collection, 'coverImageUrl'>>, events: Array<(
      { user: UserFragment }
      & ArtworkEventFragment
    )> }
    & ArtworkFragment
  )> };


export const ArtworkPageDocument = /*#__PURE__*/ `
    query ArtworkPage($contractSlug: citext!, $tokenId: Int!) {
  artworks: artwork(
    where: {tokenId: {_eq: $tokenId}, collection: {slug: {_eq: $contractSlug}}}
  ) {
    ...ArtworkFragment
    owner {
      ...UserFragment
    }
    creator: user {
      ...UserFragment
    }
    collection {
      ...CollectionFragment
      creator: user {
        ...UserFragment
      }
    }
    splitRecipients {
      id
      contractAddress
      indexOfShare
      publicKey
      sharePercent
      user {
        ...UserFragment
      }
    }
    otherArtworks: user {
      bio
      artworks(
        where: {tokenId: {_neq: $tokenId}, isIndexed: {_eq: true}, collection: {slug: {_eq: $contractSlug}}, status: {_eq: "MINTED"}}
        limit: 3
        order_by: {tokenId: desc_nulls_last}
      ) {
        ...ArtworkFragment
        ...LatestArtworkEventFragment
        ...ArtworkSplitRecipientsFragment
        ...MostRecentAuctionFragment
        owner {
          ...UserFragment
        }
        creator: user {
          ...UserFragment
        }
        collection {
          symbol
          slug
          name
          collectionImageUrl
          contractAddress
        }
      }
      artworksCount: artworks_aggregate(
        where: {isIndexed: {_eq: true}, status: {_eq: "MINTED"}, collection: {slug: {_eq: $contractSlug}}}
      ) {
        aggregate {
          count
        }
      }
    }
    collectionCoverImage: collection {
      coverImageUrl
    }
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
}
    ${ArtworkFragment}
${UserFragment}
${CollectionFragment}
${LatestArtworkEventFragment}
${ArtworkSplitRecipientsFragment}
${MostRecentAuctionFragment}
${ArtworkEventFragment}`;
export const useArtworkPage = <
      TData = ArtworkPage,
      TError = Error
    >(
      variables: ArtworkPageVariables, 
      options?: UseQueryOptions<ArtworkPage, TError, TData>
    ) => 
    useQuery<ArtworkPage, TError, TData>(
      ['ArtworkPage', variables],
      hasuraFetcher<ArtworkPage, ArtworkPageVariables>(ArtworkPageDocument, variables),
      options
    );
useArtworkPage.getKey = (variables: ArtworkPageVariables) => ['ArtworkPage', variables];
