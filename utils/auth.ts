/* eslint-disable max-lines */
import { JsonRpcProvider } from '@ethersproject/providers';
import { hexStripZeros, hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { includes } from 'ramda';

import * as Sentry from '@sentry/nextjs';

import { getUserByPublicKey } from 'queries/hasura/users';

import { getError } from 'utils/helpers';

import Account from 'types/Account';

interface NewUserRes {
  success: boolean;
  user?: Account;
  error?: string;
}

async function handleNewUserRes(res: Response): Promise<NewUserRes> {
  const success = res.ok;
  if (!success) {
    const err = await res.text();
    Sentry.captureMessage(err);
    const success = res.ok;
    return { success, error: err };
  }
  const { user } = await res.json();

  return { success, user };
}

interface HandleWalletAuthProps {
  inviteCode?: string;
  provider: JsonRpcProvider;
  onAuthenticated: (arg0: Account) => void;
  onSignMessageError: (arg: any) => void;
  onRequestAccountsSuccess: () => void;
  onSignMessageSuccess: () => void;
  onUnsupportedAccountType: () => void;
}

export async function handleWalletAuth({
  provider,
  onAuthenticated,
  onSignMessageError,
  onRequestAccountsSuccess,
  onSignMessageSuccess,
  onUnsupportedAccountType,
}: HandleWalletAuthProps): Promise<void> {
  // TODO: Reflect in state that the user clicked it
  // and use that to determine what the button shows

  // Handle the case when an account is an unsupported smart contract wallet
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const bytecode = await provider.getCode(address);
  const isSmartContract = bytecode && hexStripZeros(bytecode) !== '0x';
  if (isSmartContract) {
    return onUnsupportedAccountType();
  }

  // TODO: Use the same method for handling accounts changes
  // that we use in use-provider
  try {
    onRequestAccountsSuccess();
  } catch (err) {
    Sentry.captureException(getError(err), {
      tags: {
        section: 'auth-flow',
        function: 'handleWalletAuth → onRequestAccountsSuccess',
      },
    });
    throw new Error(err);
  }

  // Wait a little bit before triggering signature
  // This seems to fix freezing on MetaMask iOS app
  await new Promise((resolve) => setTimeout(resolve, 750));

  try {
    // TODO: Decide whether to put the the invite code
    // in the onSuccess handler here rather than passing
    // invite code through
    await handleExternalWalletAuth({
      provider,
      onAuthenticated,
      onError: onSignMessageError,
      onSuccess: onSignMessageSuccess,
    });
  } catch (err) {
    Sentry.captureException(getError(err), {
      tags: {
        section: 'auth-flow',
        function: 'handleWalletAuth → handleExternalWalletAuth',
      },
    });
    onSignMessageError(err);
  }
}

// ETH token functions
export const createToken = async (
  provider: JsonRpcProvider,
  publicKey: string
): Promise<string> => {
  const message = 'Please sign this message to connect to Foundation.';
  const hexlifiedMessage = hexlify(toUtf8Bytes(message));
  const signature = await provider.send('personal_sign', [
    hexlifiedMessage,
    publicKey.toLowerCase(),
  ]);

  const encodedMessage = encodeData(message);
  return `${encodedMessage}.${signature}`;
};

const encodeData = (
  unencoded:
    | WithImplicitCoercion<string>
    | { [Symbol.toPrimitive](hint: 'string'): string }
) => {
  try {
    return Buffer.from(unencoded, 'binary').toString('base64');
  } catch (err) {
    throw new Error(err);
  }
};

export const decodeData = (encoded: string): string => {
  try {
    return Buffer.from(encoded, 'base64').toString('binary');
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

interface HandleExternalWalletAuthProps {
  inviteCode?: string;
  provider: JsonRpcProvider;
  onAuthenticated: (arg0: Account) => void;
  onError: (error: any) => void;
  onSuccess: () => void;
}

async function handleExternalWalletAuth({
  provider,
  onAuthenticated,
  onError,
  onSuccess,
}: HandleExternalWalletAuthProps) {
  try {
    const token = await getToken(provider);
    const providerConn = provider.connection.url;
    const signer = provider.getSigner();

    const publicKey = await signer.getAddress();

    const userQuery = await getUserByPublicKey({ publicKey });

    const providerType =
      providerConn === 'metamask' ? 'METAMASK' : 'WALLETCONNECT';

    // TODO: Make this more RESTful
    // TODO: Remove publicAddress from the request body and decode it from JWT
    // on the api/connect side
    const res = await fetch('/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        providerType,
        // dictates whether we await the user upsert
        // in the /new-external-wallet-user API route
        userExists: Boolean(userQuery.user),
      }),
    });

    const { success, user, error } = await handleNewUserRes(res);

    if (!success) {
      throw new Error(error);
    }
    onSuccess();
    onAuthenticated(user);
  } catch (err) {
    Sentry.captureException(getError(err), {
      tags: { section: 'auth-flow', function: 'handleExternalWalletAuth' },
    });

    onError(err);
  }
}

export async function getToken(provider: JsonRpcProvider): Promise<string> {
  const signer = provider.getSigner();
  const publicAddress = await signer.getAddress();

  // Note: This step requires the user to sign a message in the MetaMask extension
  const token = await createToken(provider, publicAddress);

  return token;
}

export const isAuthenticatedRoute = (pathname: string): boolean => {
  const authenticatedRoutes = [
    '/[username]/[contractAddress]/[tokenId]/bid',
    '/[username]/[contractAddress]/[tokenId]/bid/submitted',
    '/[username]/[contractAddress]/[tokenId]/settle',
    '/[username]/[contractAddress]/[tokenId]/settle/submitted',
    '/[username]/[contractAddress]/[tokenId]/list',
    '/[username]/[contractAddress]/[tokenId]/list/submitted',
    '/[username]/[contractAddress]/[tokenId]/change-price',
    '/[username]/[contractAddress]/[tokenId]/change-price/submitted',
    '/[username]/[contractAddress]/[tokenId]/unlist',
    '/[username]/[contractAddress]/[tokenId]/unlist/submitted',
    '/admin/approve',
    '/create',
    '/create/upload',
    '/create/collection',
    '/create/mint/[id]',
    '/create/list/[contractAddress]/[tokenId]',
    '/creator/[contractAddress]/[tokenId]/tags',
    '/profile',
    '/profile/verify',
    '/profile/verify/twitter',
    '/profile/verify/instagram',
    '/invite',
    '/join',
    '/feed',
    '/notifications',
    '/settings',
    '/migrate-account',
    '/activity',
  ];

  return includes(pathname, authenticatedRoutes);
};
