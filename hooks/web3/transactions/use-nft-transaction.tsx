/* eslint-disable max-lines */
import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';

import {
  sendNFTTransferTransaction,
  sendNFTMarketUnlistTransaction,
  sendNFTMarketChangePriceTransaction,
  sendNFTBurnTransaction,
} from 'utils/web3/transactions/send-nft-transaction';

import {
  MethodEnum,
  SendMarketTransactionUnlistParams,
  SendMarketTransactionChangePriceParams,
  SendNFTTransactionTransferParams,
  SendNFTTransactionBurnParams,
} from 'types/NFTMarketInterface';

import useReadOnlyProvider from '../use-read-only-provider';
import { getError } from 'utils/helpers';

interface UseNFTTransactionProps {
  method: MethodEnum;
}

interface SendTransactionSharedParams {
  shouldWait?: boolean;
}

interface SendTransactionTransferParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionTransferParams {}

interface SendTransactionBurnParamsWithShared
  extends SendTransactionSharedParams,
    SendNFTTransactionBurnParams {}

interface SendTransactionUnlistParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionUnlistParams {}

interface SendTransactionChangePriceParamsWithShared
  extends SendTransactionSharedParams,
    SendMarketTransactionChangePriceParams {}

export default function useNFTTransaction({ method }: UseNFTTransactionProps): {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error;
  isProviderLoading: boolean;
  sendTransferTransaction: (
    arg0: SendTransactionTransferParamsWithShared
  ) => Promise<string>;
  sendBurnTransaction: (
    arg0: SendTransactionBurnParamsWithShared
  ) => Promise<string>;
  sendUnlistTransaction: (
    arg0: SendTransactionUnlistParamsWithShared
  ) => Promise<string>;
  sendChangePriceTransaction: (
    arg0: SendTransactionChangePriceParamsWithShared
  ) => Promise<string>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [error, setError] = useState(null);
  const { library: provider, active: isProviderActiveFromHook } =
    useWeb3React();

  const { provider: estimateGasProvider } = useReadOnlyProvider();

  const isWrongNetwork = useIsWrongNetwork();

  const hookItselfIsLoading = !isProviderActiveFromHook;

  if (isWrongNetwork) {
    // TODO: Put similar return to hookItselfIsLoading case below
  }

  if (hookItselfIsLoading) {
    return {
      sendTransferTransaction: async () => {
        return ''; // do nothing
      },
      sendBurnTransaction: async () => {
        return ''; // do nothing
      },
      sendUnlistTransaction: async () => {
        return ''; // do nothing
      },
      sendChangePriceTransaction: async () => {
        return ''; // do nothing
      },
      isLoading,
      isError,
      error,
      isSuccess,
      isProviderLoading: hookItselfIsLoading,
    };
  }

  async function sendTransferTransaction({
    shouldWait = false,
    from,
    to,
    tokenId,
    contractAddress,
  }: SendTransactionTransferParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Transfer) {
        throw new Error('Methods other than transfer not supported');
      }
      const { tx, txHash } = await sendNFTTransferTransaction({
        provider,
        estimateGasProvider,
        from,
        to,
        tokenId,
        contractAddress,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendBurnTransaction({
    shouldWait = false,
    tokenId,
    contractAddress,
  }: SendTransactionBurnParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Burn) {
        throw new Error('Methods other than transfer not supported');
      }
      const { tx, txHash } = await sendNFTBurnTransaction({
        provider,
        estimateGasProvider,
        tokenId,
        contractAddress,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendUnlistTransaction({
    shouldWait = false,
    auctionId,
  }: SendTransactionUnlistParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.Unlist) {
        throw new Error('Methods other than list not supported');
      }
      const { tx, txHash } = await sendNFTMarketUnlistTransaction({
        provider,
        estimateGasProvider,
        auctionId,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }

  async function sendChangePriceTransaction({
    shouldWait = false,
    auctionId,
    reservePrice,
  }: SendTransactionChangePriceParamsWithShared) {
    setIsLoading(true);
    try {
      if (method !== MethodEnum.ChangePrice) {
        throw new Error('Methods other than change price not supported');
      }
      const { tx, txHash } = await sendNFTMarketChangePriceTransaction({
        provider,
        estimateGasProvider,
        // gasData: gasData,
        auctionId,
        reservePrice,
      });
      if (shouldWait) {
        await tx.wait();
      }
      setIsSuccess(true);
      setIsLoading(false);
      return txHash;
    } catch (error) {
      Sentry.captureException(getError(error));
      setError(error);
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  }
  return {
    sendTransferTransaction,
    sendBurnTransaction,
    sendUnlistTransaction,
    sendChangePriceTransaction,
    isLoading,
    isError,
    error,
    isSuccess,
    isProviderLoading: hookItselfIsLoading,
  };
}
