import { useQueryClient, UseMutationOptions } from 'react-query';
import * as Sentry from '@sentry/nextjs';

import { getError } from 'utils/helpers';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useDisconnectWalletSession from 'hooks/web3/wallet/use-disconnect-wallet-session';

import {
  useUpsertUser as useUpsertUserBaseHook,
  UpsertUser,
  UpsertUserVariables,
} from 'graphql/server/mutations/upsert-user.generated';

import {
  useUserWithEmailByPublicKey,
  UserWithEmailByPublicKey,
} from 'graphql/server/queries/user-with-email-by-public-key.generated';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useUpsertUser(
  options?: UseMutationOptions<UpsertUser, Error, UpsertUserVariables>
) {
  const { mutateAsync: handleLogout } = useDisconnectWalletSession();

  const queryClient = useQueryClient();

  return useUpsertUserBaseHook({
    ...options,
    onSuccess: async (data) => {
      const publicKey = data.upsertUser.publicKey;

      queryClient.setQueryData<UserWithEmailByPublicKey>(
        useUserWithEmailByPublicKey.getKey({ publicKey }),
        { user: data.upsertUser }
      );
      await queryClient.invalidateQueries(
        useUserByPublicKey.getKey({ publicKey })
      );
    },
    onError: async (error) => {
      await handleLogout();
      Sentry.captureException(getError(error));
    },
  });
}
