import { UseMutationOptions } from 'react-query';
import {
  ContractTransaction,
  PayableOverrides,
} from '@ethersproject/contracts';

import useWeb3Mutation from 'hooks/web3/use-web3-mutation';

import { toBNFixed } from 'utils/numbers';
import { calculateGasMargin } from 'utils/gas';
import { getNFTMarketContract } from 'lib/contracts';

interface PlaceBidVariables {
  auctionId: number;
  price: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function usePlaceBid<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    PlaceBidVariables,
    TContext
  >
) {
  return useWeb3Mutation(async (variables) => {
    const { provider, auctionId, price } = variables;

    const txArg = auctionId;
    const value = toBNFixed(price);
    const signer = provider.getSigner();

    const nftMarketContract = getNFTMarketContract(signer);

    const signerAddress = await signer.getAddress();

    const estimatedGas = await nftMarketContract.estimateGas.placeBid(txArg, {
      from: signerAddress,
      value,
    });

    const gasLimit = calculateGasMargin(estimatedGas);

    const txOptions: PayableOverrides = {
      gasLimit: gasLimit.toString(),
      value,
    };

    return await nftMarketContract.placeBid(txArg, txOptions);
  }, options);
}
