import { UseMutationOptions } from 'react-query';
import { ContractTransaction, Overrides } from '@ethersproject/contracts';
import { BigNumberish } from '@ethersproject/bignumber';

import useWeb3Mutation from 'hooks/web3/use-web3-mutation';

import { calculateGasMargin } from 'utils/gas';
import { getNFTMarketContract } from 'lib/contracts';

interface FinalizeReserveAuctionVariables {
  auctionId: BigNumberish;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useFinalizeReserveAuction<
  TError = Error,
  TContext = unknown
>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    FinalizeReserveAuctionVariables,
    TContext
  >
) {
  return useWeb3Mutation(async (variables) => {
    const { provider, auctionId } = variables;

    const signer = provider.getSigner();

    const nftMarketContract = getNFTMarketContract(signer);

    const signerAddress = await signer.getAddress();

    const estimatedGas =
      await nftMarketContract.estimateGas.finalizeReserveAuction(auctionId, {
        from: signerAddress,
      });

    const gasLimit = calculateGasMargin(estimatedGas);

    const txOptions: Overrides = {
      gasLimit: gasLimit.toString(),
    };

    return await nftMarketContract.finalizeReserveAuction(auctionId, txOptions);
  }, options);
}
