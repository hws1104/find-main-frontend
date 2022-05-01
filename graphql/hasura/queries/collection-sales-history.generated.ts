import * as Types from '../types-hasura.generated';

import { UserFragment, ArtworkFragment, CollectionFragment, LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment, MostRecentAuctionFragment, ArtworkEventFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type CollectionSalesHistoryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String'];
  limit: Types.Scalars['Int'];
  offset: Types.Scalars['Int'];
}>;


export type CollectionSalesHistory = { collectionSalesHistory: Array<(
    Pick<Types.Collection_Sales_History, 'tokenId' | 'dateSold' | 'eventType' | 'name' | 'numBids' | 'priceLastSoldFor'>
    & { buyer?: Types.Maybe<UserFragment>, seller?: Types.Maybe<UserFragment>, artwork?: Types.Maybe<(
      { collection?: Types.Maybe<CollectionFragment>, creator?: Types.Maybe<UserFragment> }
      & ArtworkFragment
    )> }
  )> };


export const CollectionSalesHistoryDocument = /*#__PURE__*/ `
    query CollectionSalesHistory($contractAddress: String!, $limit: Int!, $offset: Int!) {
  collectionSalesHistory: collection_sales_history(
    where: {contractAddress: {_eq: $contractAddress}}
    order_by: {dateSold: desc}
    limit: $limit
    offset: $offset
  ) {
    tokenId
    dateSold
    eventType
    name
    numBids
    priceLastSoldFor
    buyer {
      ...UserFragment
    }
    seller {
      ...UserFragment
    }
    artwork {
      ...ArtworkFragment
      collection {
        ...CollectionFragment
      }
      creator: user {
        ...UserFragment
      }
    }
  }
}
    ${UserFragment}
${ArtworkFragment}
${CollectionFragment}`;
export const useCollectionSalesHistory = <
      TData = CollectionSalesHistory,
      TError = Error
    >(
      variables: CollectionSalesHistoryVariables, 
      options?: UseQueryOptions<CollectionSalesHistory, TError, TData>
    ) => 
    useQuery<CollectionSalesHistory, TError, TData>(
      ['CollectionSalesHistory', variables],
      hasuraFetcher<CollectionSalesHistory, CollectionSalesHistoryVariables>(CollectionSalesHistoryDocument, variables),
      options
    );
useCollectionSalesHistory.getKey = (variables: CollectionSalesHistoryVariables) => ['CollectionSalesHistory', variables];
