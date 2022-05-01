import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import { getFirstValue, isAllTrue } from 'utils/helpers';

export default function useContractEventHandler(): [
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const router = useRouter();

  const [isEventEmitted, setIsEventEmitted] = useState(false);

  const isSuccess = getFirstValue(router.query.success);

  const handleSubmittedEvent = useCallback(
    () => {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          success: true,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  const submittedEventReady = isAllTrue([
    !isSuccess,
    isEventEmitted,
    router.isReady,
  ]);

  useEffect(() => {
    if (submittedEventReady) {
      handleSubmittedEvent();
    }
  }, [submittedEventReady, handleSubmittedEvent]);

  useEffect(() => {
    if (isSuccess) {
      setIsEventEmitted(true);
    }
  }, [isSuccess]);

  return [isEventEmitted, setIsEventEmitted];
}
