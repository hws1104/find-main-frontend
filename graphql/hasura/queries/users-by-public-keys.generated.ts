import * as Types from '../types-hasura.generated';

import { UserFragment, ArtworkFragment, CollectionFragment, LatestArtworkEventFragment, ArtworkSplitRecipientsFragment, AuctionFragment, BidFragment, MostRecentAuctionFragment, ArtworkEventFragment } from '../hasura-fragments.generated';
import { useQuery, UseQueryOptions } from 'react-query';
import { hasuraFetcher } from 'lib/clients/graphql';
export type UsersByPublicKeysVariables = Types.Exact<{
  publicKeys: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type UsersByPublicKeys = { users: Array<UserFragment> };


export const UsersByPublicKeysDocument = /*#__PURE__*/ `
    query UsersByPublicKeys($publicKeys: [String!]!) {
  users: user(where: {publicKey: {_in: $publicKeys}}) {
    ...UserFragment
  }
}
    ${UserFragment}`;
export const useUsersByPublicKeys = <
      TData = UsersByPublicKeys,
      TError = Error
    >(
      variables: UsersByPublicKeysVariables, 
      options?: UseQueryOptions<UsersByPublicKeys, TError, TData>
    ) => 
    useQuery<UsersByPublicKeys, TError, TData>(
      ['UsersByPublicKeys', variables],
      hasuraFetcher<UsersByPublicKeys, UsersByPublicKeysVariables>(UsersByPublicKeysDocument, variables),
      options
    );
useUsersByPublicKeys.getKey = (variables: UsersByPublicKeysVariables) => ['UsersByPublicKeys', variables];
