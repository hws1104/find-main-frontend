import { useRouter } from 'next/router';
import { getFirstValue } from 'utils/helpers';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useTransactionParams() {
  const router = useRouter();

  return {
    txHash: getFirstValue(router.query.txHash),
    tokenId: getFirstValue(router.query.tokenId),
    contractSlug: getFirstValue(router.query.contractAddress),
  };
}
