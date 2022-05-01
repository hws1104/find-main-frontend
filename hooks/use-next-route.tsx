import { useRouter } from 'next/router';
import { unless, startsWith } from 'ramda';
import { getFirstValue } from 'utils/helpers';
import useTransactionParams from './use-transaction-params';

const maybePrependSlash = unless(startsWith('/'), (path) => `/${path}`);

export default function useNextRoute(pathname: string): string {
  const router = useRouter();

  const username = getFirstValue(router.query.username);

  const { contractSlug, tokenId } = useTransactionParams();

  const basePath = `/${username}/${contractSlug}/${tokenId}`;

  return basePath + maybePrependSlash(pathname);
}

export function useNextRouteCreator(pathname: string): string {
  const { contractSlug, tokenId } = useTransactionParams();

  const basePath = `/creator/${contractSlug}/${tokenId}`;

  return basePath + maybePrependSlash(pathname);
}
