import { UseQueryOptions } from 'react-query';

import {
  useUserActivityCount as useUserActivityCountBaseHook,
  UserActivityCount,
  UserActivityCountVariables,
} from 'graphql/hasura/queries/user-activity-count.generated';

import { isAllTrue } from 'utils/helpers';

const currentDate = new Date().toISOString();

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUserActivityCount(
  variables: Pick<UserActivityCountVariables, 'publicKey'>,
  options?: UseQueryOptions<UserActivityCount, Error, number>
) {
  return useUserActivityCountBaseHook(
    { ...variables, currentDate },
    {
      ...options,
      enabled: isAllTrue(Object.values(variables)),
      select: (res) => {
        const placedBidsOpenCount = res.placedBidsOpenCount.aggregate.count;
        const placedBidsEndedCount = res.placedBidsEndedCount.aggregate.count;
        const receivedBidsCount = res.receivedBidsCount.aggregate.count;
        const privateSalesCount = res.privateSalesCount.aggregate.count;
        return (
          placedBidsOpenCount +
          placedBidsEndedCount +
          receivedBidsCount +
          privateSalesCount
        );
      },
    }
  );
}
