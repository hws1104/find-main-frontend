import { useLocalStorage as useLocalStorageHook } from 'react-use';
import useLocalStorage from 'hooks/use-local-storage';

import { WalletConnector, WalletEvent } from 'types/Wallet';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useWalletLocalStorage() {
  const [latestOp, setLatestOp] = useLocalStorage<WalletEvent | ''>(
    'latest_op',
    ''
  );
  const [latestConnector, setLatestConnector] = useLocalStorage<
    WalletConnector | ''
  >('latest_connector', '');

  const [, , resetWalletConnectState] =
    useLocalStorageHook<string>('walletconnect');

  return {
    latestOp,
    setLatestOp,
    latestConnector,
    setLatestConnector,
    resetWalletConnectState,
  };
}
