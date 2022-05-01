import * as Types from '../types-hasura.generated';

import { UserFragment, ArtworkFragment, CollectionFragment, LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment, MostRecentAuctionFragment, ArtworkEventFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UserByPublicKeyVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type UserByPublicKey = { user?: Types.Maybe<UserFragment> };


export const UserByPublicKeyDocument = /*#__PURE__*/ `
    query UserByPublicKey($publicKey: String!) {
  user: user_by_pk(publicKey: $publicKey) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useUserByPublicKey = <
      TData = UserByPublicKey,
      TError = Error
    >(
      variables: UserByPublicKeyVariables, 
      options?: UseQueryOptions<UserByPublicKey, TError, TData>
    ) => 
    useQuery<UserByPublicKey, TError, TData>(
      ['UserByPublicKey', variables],
      hasuraFetcher<UserByPublicKey, UserByPublicKeyVariables>(UserByPublicKeyDocument, variables),
      options
    );
useUserByPublicKey.getKey = (variables: UserByPublicKeyVariables) => ['UserByPublicKey', variables];
