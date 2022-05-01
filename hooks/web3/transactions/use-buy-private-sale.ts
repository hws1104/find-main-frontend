import { useWeb3React } from '@web3-react/core';
import { useMutation, UseMutationOptions } from 'react-query';
import { BytesLike, splitSignature } from 'ethers/lib/utils';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumberish } from '@ethersproject/bignumber';
import {
  PayableOverrides,
  ContractTransaction,
} from '@ethersproject/contracts';

import {
  getNFTMarketContract,
  getNFTMarketContractToRead,
} from 'lib/contracts';

import { calculateGasMargin } from 'utils/gas';
import { toBNFixed } from 'utils/numbers';

export interface BuyPrivateSaleVariables {
  buyerAddress: string;
  tokenId: BigNumberish;
  contractAddress: string;
  deadline: number;
  signature: string;
  price: number;
}

type BuyFromPrivateSaleArgs = [
  string,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BytesLike,
  BytesLike
];

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useBuyPrivateSale<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    BuyPrivateSaleVariables,
    TContext
  >
) {
  const { library: provider } = useWeb3React<Web3Provider>();

  return useMutation(async (variables) => {
    const {
      tokenId,
      contractAddress,
      buyerAddress,
      deadline,
      signature,
      price,
    } = variables;

    if (!provider) {
      throw Error('No Provider Error');
    }

    const signer = provider.getSigner();

    const nftMarketContract = getNFTMarketContract(signer);

    const nftMarketContractForEstimation = getNFTMarketContractToRead(provider);

    const { estimateGas } = nftMarketContractForEstimation;

    const { v, r, s } = splitSignature(signature);

    const txArgs: BuyFromPrivateSaleArgs = [
      contractAddress,
      tokenId,
      deadline,
      v,
      r,
      s,
    ];

    const estimatedGas = await estimateGas.buyFromPrivateSale(...txArgs, {
      from: buyerAddress,
      value: toBNFixed(price),
    });

    const gasLimit = calculateGasMargin(estimatedGas);

    const txOptions: PayableOverrides = {
      gasLimit: gasLimit.toString(),
      value: toBNFixed(price),
    };

    return await nftMarketContract.buyFromPrivateSale(...txArgs, txOptions);
  }, options);
}
