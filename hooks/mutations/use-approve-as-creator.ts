import { useMutation } from 'react-query';
import * as Sentry from '@sentry/nextjs';
import { approveAsCreator } from 'queries/users';
import { getError } from 'utils/helpers';

export default function useApproveAsCreator() {
  return useMutation(approveAsCreator, {
    onError: (error) => {
      Sentry.captureException(getError(error));
    },
  });
}
