import {
  AlchemyProvider,
  AlchemyWebSocketProvider,
  Networkish,
} from '@ethersproject/providers';
import getChainId from 'lib/chainId';
import getAlchemyAPIKey from 'lib/getAlchemyAPIKey';

let provider: AlchemyWebSocketProvider;
const providerCache = new Map();

interface UseProviderResult {
  provider: AlchemyWebSocketProvider;
}

const systemChainId = getChainId();

export default function useReadOnlyProvider(
  providedChainId?: Networkish
): UseProviderResult {
  const chainId = providedChainId ?? systemChainId;
  if (providerCache.has(chainId)) {
    provider = providerCache.get(chainId);
  } else {
    providerCache.set(
      chainId,
      AlchemyProvider.getWebSocketProvider(chainId, getAlchemyAPIKey())
    );
    provider = providerCache.get(chainId);
  }

  return { provider };
}
