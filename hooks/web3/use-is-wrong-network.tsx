import { useWeb3React } from '@web3-react/core';

import getChainId from 'lib/chainId';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useIsWrongNetwork() {
  const { chainId } = useWeb3React();

  return chainId !== getChainId();
}
