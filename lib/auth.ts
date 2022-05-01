/* eslint-disable max-lines */
import Iron from '@hapi/iron';
import axios from 'axios';
import { JsonRpcProvider } from '@ethersproject/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';

import { getUserByPublicKey } from 'queries/hasura/users';

import { getToken } from 'utils/auth';

import WalletUser from 'types/WalletUser';
import { WalletConnector } from 'types/Wallet';

const TOKEN_SECRET = process.env.IRON_SECRET;
const TOKEN_NAME = 'f8n_token';
// 15 days
const MAX_AGE = 60 * 60 * 24 * 15;

interface WalletSession {
  done: boolean;
  user: WalletUser;
}

interface WalletSessionArgs {
  provider: JsonRpcProvider;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function connectWalletSession(args: WalletSessionArgs) {
  const { provider } = args;

  const signer = provider.getSigner();

  const [token, publicKey] = await Promise.all([
    getToken(provider),
    signer.getAddress(),
  ]);

  const userQuery = await getUserByPublicKey({ publicKey });

  return await connectWalletApiSession({
    token,
    userExists: Boolean(userQuery.user),
    providerType: getProviderType(provider.connection.url),
  });
}

export async function getWalletSession() {
  return await axios.get<{ user: WalletUser }>('/api/user');
}

export async function disconnectWalletSession() {
  return await axios.post<{ done: boolean }>('/api/disconnect');
}

interface ConnectWalletApiSessionArgs {
  token: string;
  userExists: boolean;
  providerType: WalletConnector;
}

async function connectWalletApiSession(args: ConnectWalletApiSessionArgs) {
  return await axios.post<WalletSession>('/api/connect', args);
}

const getProviderType = (connectionUrl: string): WalletConnector =>
  connectionUrl === 'metamask' ? 'METAMASK' : 'WALLETCONNECT';

// TODO: No reason to have so much info in the session
// This WalletUser type can get smaller over time
export function encryptSession(session: WalletUser): Promise<string> {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults);
}

export async function getSession(req: NextApiRequest): Promise<WalletUser> {
  const token = getTokenCookie(req);
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
}

function parseCookies(req: { cookies: any; headers: { cookie: any } }) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) {
    return req.cookies;
  }

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function setTokenCookie(
  res: { setHeader: (arg0: string, arg1: any) => void },
  token: string
): void {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getTokenCookie(req: any) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function removeTokenCookie(
  res: NextApiResponse<{ done: boolean } | { user: WalletUser }>
): void {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export async function encryptAndSaveSession({ session, res }): Promise<void> {
  const sessionToken = await encryptSession(session);

  setTokenCookie(res, sessionToken);
}
