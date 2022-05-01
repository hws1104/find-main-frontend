import { UseQueryOptions } from 'react-query';

import {
  ArtworkByContractTokenId,
  useArtworkByContractTokenId as useArtworkByContractTokenIdBaseHook,
} from 'graphql/hasura/queries/artwork-by-contract-token-id.generated';

import useTransactionParams from 'hooks/use-transaction-params';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { getFirstValue, isAllTrue } from 'utils/helpers';
import { isQueryEnabled } from 'hooks/queries/shared';

interface UseArtworkByContractTokenIdVariables {
  contractSlug: string;
  tokenId: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useArtworkByContractTokenId(
  variables: UseArtworkByContractTokenIdVariables,
  options?: UseQueryOptions<
    ArtworkByContractTokenId,
    Error,
    ArtworkFragmentExtended
  >
) {
  const contractAddressHook = useArtworkByContractTokenIdBaseHook(
    {
      tokenId: variables.tokenId,
      contractSlug: variables.contractSlug,
    },
    {
      ...options,
      enabled: isAllTrue([
        variables.contractSlug,
        variables.tokenId,
        isQueryEnabled(options),
      ]),
      select: (res) => getFirstValue(res.artworks),
    }
  );

  return contractAddressHook;
}

useArtworkByContractTokenId.getKey = useArtworkByContractTokenIdBaseHook.getKey;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function useArtworkByContractTokenIdFromRouter(
  options?: UseQueryOptions<
    ArtworkByContractTokenId,
    Error,
    ArtworkFragmentExtended
  >
) {
  const { contractSlug, tokenId } = useTransactionParams();
  return useArtworkByContractTokenId(
    { contractSlug, tokenId: Number(tokenId) },
    options
  );
}
