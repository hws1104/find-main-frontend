import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';

import { TwitterFormValues } from './types';

import TwitterView from 'components/verify/twitter/TwitterView';

import { useSocialVerificationByService } from 'hooks/queries/hasura/use-social-verification';
import { useCreateSocialVerificationViaUrl } from 'graphql/server/mutations/create-social-verification-via-url.generated';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';

import TwitterSuccess from '../shared/SocialSuccess';
import TwitterVerifying from '../shared/SocialVerifying';
import SocialError from '../shared/SocialError';
import LoadingPage from 'components/LoadingPage';

import { getFirstValue } from 'utils/helpers';
import { SocialVerifService } from 'types/SocialVerification';

interface TwitterContainerProps {
  reset: (arg0: number) => void;
  key: number;
}

export default function TwitterContainer(
  props: TwitterContainerProps
): JSX.Element {
  const { reset } = props;

  const router = useRouter();

  const redirectPath = getFirstValue(router.query['redirect-path']);

  const [isCreateError, setIsCreateError] = useState(false);
  const [tweetURL, setTweetURL] = useState('');

  const { data: user } = useWalletSession();

  const {
    mutateAsync: createSocialVerification,
    isLoading: createSocialVerificationLoading,
    error: createSocialVerificationError,
  } = useCreateSocialVerificationViaUrl();

  const POLL_INTERVAL = 2000;

  // TODO: Use skip param to stop polling on success or error screen
  const {
    data: socialVerificationData,
    isLoading: socialVerificationLoading,
    error: socialVerificationGetError,
  } = useSocialVerificationByService(
    { publicKey: user?.publicAddress, service: SocialVerifService.TWITTER },
    { refetchInterval: POLL_INTERVAL }
  );

  const hasVerificationResult = !socialVerificationGetError;

  const socialVerification = socialVerificationData;

  const isValid = socialVerification?.isValid;
  const socialVerificationURL = socialVerification?.socialVerificationURL;
  const failedReason = socialVerification?.failedReason;

  const handleSubmit = useCallback(
    async (values: TwitterFormValues): Promise<void> => {
      const tweetURLString: string = values.tweetURL;
      setTweetURL(tweetURLString);
      try {
        await createSocialVerification({
          socialVerificationURL: tweetURLString,
        });
      } catch (error) {
        // This is most likely because they used a tweet URL that
        // has been used before
        setIsCreateError(true);
      }
    },
    [createSocialVerification]
  );

  // Only once it's marked as isValid of true or false, not when it's
  // null since we don't fetch that
  const newDataInDB = tweetURL === socialVerificationURL;

  const isSuccessful = isValid && newDataInDB;
  const isLoading =
    socialVerificationLoading || createSocialVerificationLoading;
  const isVerifying = !newDataInDB && !!tweetURL;
  const isError =
    (newDataInDB &&
      !isValid &&
      hasVerificationResult &&
      tweetURL === socialVerificationURL) ||
    isCreateError ||
    createSocialVerificationError;

  useEffect(() => {
    if (!isError && !isLoading && !isVerifying && !isSuccessful) {
      Sentry.captureMessage(
        'User encountered unhandled case on Twitter verification'
      );
    }
  }, [isError, isLoading, isSuccessful, isVerifying]);

  if (isSuccessful) {
    return <TwitterSuccess redirectPath={redirectPath} />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  // If there's an entry but there was no Twitter username fetched from
  // the tweet, the hook that fetches data for this page
  // will return an error, and thus there won't be
  // a verification result.

  if (isError) {
    return (
      <SocialError
        failedReason={failedReason}
        reset={() => {
          reset(Date.now());
        }}
      />
    );
  }

  if (isVerifying) {
    return <TwitterVerifying />;
  }

  return <TwitterView onSubmit={handleSubmit} />;
}
