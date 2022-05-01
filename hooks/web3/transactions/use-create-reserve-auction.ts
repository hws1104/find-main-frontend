import { UseMutationOptions } from 'react-query';
import { BigNumberish } from '@ethersproject/bignumber';
import { ContractTransaction, Overrides } from '@ethersproject/contracts';

import useWeb3Mutation from 'hooks/web3/use-web3-mutation';

import { calculateGasMargin } from 'utils/gas';
import { getNFTMarketContract } from 'lib/contracts';

type CreateReserveAuctionArgs = [string, BigNumberish, BigNumberish];

interface CreateReserveAuctionVariables {
  contractAddress: string;
  tokenId: BigNumberish;
  reservePrice: BigNumberish;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useCreateReserveAuction<
  TError = Error,
  TContext = unknown
>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    CreateReserveAuctionVariables,
    TContext
  >
) {
  return useWeb3Mutation(async (variables) => {
    const { provider, tokenId, contractAddress, reservePrice } = variables;

    const signer = provider.getSigner();

    const nftMarketContract = getNFTMarketContract(signer);

    const signerAddress = await signer.getAddress();

    const txArgs: CreateReserveAuctionArgs = [
      contractAddress,
      tokenId,
      reservePrice,
    ];

    const estimatedGas =
      await nftMarketContract.estimateGas.createReserveAuction(...txArgs, {
        from: signerAddress,
      });

    const gasLimit = calculateGasMargin(estimatedGas);

    const txOptions: Overrides = {
      gasLimit: gasLimit.toString(),
    };

    return await nftMarketContract.createReserveAuction(...txArgs, txOptions);
  }, options);
}
