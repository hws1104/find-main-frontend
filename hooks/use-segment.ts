import { useEffect } from 'react';
import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

export let analytics: Analytics | undefined = undefined;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useSegment() {
  const segmentKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!analytics && segmentKey) {
        const [response] = await AnalyticsBrowser.load({
          writeKey: segmentKey,
        });
        analytics = response;
      }
    };
    loadAnalytics();
  }, []);

  return analytics;
}
