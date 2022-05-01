import { last } from 'ramda';
import { useEffect } from 'react';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';
import { VirtualItem } from 'react-virtual';

export type FetchNextPageFn<T> = (
  options?: FetchNextPageOptions
) => Promise<InfiniteQueryObserverResult<T[], Error>>;

interface FetchVirtualizedDataArgs<T> {
  data: T[];
  virtualItems: VirtualItem[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useFetchVirtualizedData<T>({
  data,
  virtualItems,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: FetchVirtualizedDataArgs<T>) {
  // this useEffect fires as we scroll
  return useEffect(
    () => {
      // get the last element from the virtual scroll
      const lastItem = last(virtualItems);

      if (!lastItem) {
        return;
      }

      // when the last element is appended to the virtual scroll
      const isLastItem = lastItem.index === data.length - 1;

      // we then fire a request to get the next page
      if (isLastItem && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.length, virtualItems, isFetchingNextPage]
  );
}
