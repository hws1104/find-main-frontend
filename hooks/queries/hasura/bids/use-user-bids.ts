import { uniqBy, path } from 'ramda';
import { UseQueryOptions } from 'react-query';

import { ActivityBidFragment } from 'graphql/hasura/hasura-fragments.generated';
import {
  useUserBids as useUserBidsBaseHook,
  UserBidsVariables,
  UserBids,
} from 'graphql/hasura/queries/user-bids.generated';

import { maybeGetAddress } from 'utils/users';

interface UserBidsUnion {
  bidsReceived: UserBids['bidsReceived'];
  bidsPlaced: UserBids['bidsReceived'];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserBids(
  variables: UserBidsVariables,
  options?: UseQueryOptions<UserBids, Error, UserBidsUnion>
) {
  const { publicKey } = variables;

  return useUserBidsBaseHook(
    { publicKey: maybeGetAddress(publicKey) },
    {
      enabled: Boolean(publicKey),
      select: (res) => ({
        bidsReceived: uniqBy<ActivityBidFragment, number>(
          path(['auction', 'auctionId']),
          res.bidsReceived
        ),
        bidsPlaced: uniqBy<ActivityBidFragment, number>(
          path(['auction', 'auctionId']),
          [...res.bidsPlacedOpen, ...res.bidsPlacedEnded]
        ),
      }),
      ...options,
    }
  );
}
