import useIsInViewport, { HookOptions, CallbackRef } from 'use-is-in-viewport';

import { useState, useEffect } from 'react';

export default function useOnceInViewport(
  options?: HookOptions
): [boolean, CallbackRef] {
  const [isInViewport, ref] = useIsInViewport(options);

  const [wasInViewportAtleastOnce, setWasInViewportAtleastOnce] =
    useState(isInViewport);

  useEffect(() => {
    setWasInViewportAtleastOnce((prev) => {
      // this will clamp it to the first true
      // received from useIsInViewport
      if (!prev) {
        return isInViewport;
      }
      return prev;
    });
  }, [isInViewport]);

  return [wasInViewportAtleastOnce, ref];
}
