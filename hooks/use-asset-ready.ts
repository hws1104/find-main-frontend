import { useQuery, UseQueryResult } from 'react-query';
import { isAllTrue } from 'utils/helpers';

export default function useAssetReady(
  url: string,
  enabled: boolean
): UseQueryResult<boolean, Error> {
  return useQuery(
    ['AssetUrlIsReady', url],
    async () => {
      const res = await fetch(url, {
        method: 'HEAD',
      });
      if (res.ok) {
        return res.ok;
      }

      throw res.ok;
    },
    {
      enabled: isAllTrue([url, enabled]),
      retry: 20,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );
}
