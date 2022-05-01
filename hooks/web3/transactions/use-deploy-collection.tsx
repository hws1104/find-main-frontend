import {
  ContractTransaction,
  Contract,
  ContractInterface,
  Overrides,
} from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/providers';
import { UseMutationOptions } from 'react-query';

import useWeb3Mutation from 'hooks/web3/use-web3-mutation';

import { getCollectionFactoryAddress } from 'lib/addresses';
import { calculateGasMargin } from 'utils/gas';

interface DeployCollectionVariables {
  name: string;
  symbol: string;
  nonce: number;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useDeployCollection<TError = Error, TContext = unknown>(
  options?: UseMutationOptions<
    ContractTransaction,
    TError,
    DeployCollectionVariables,
    TContext
  >
) {
  return useWeb3Mutation(async (variables) => {
    const { provider, name, symbol, nonce } = variables;

    const signer = provider.getSigner();

    const collectionFactory = getCollectionFactory(signer);

    const { estimateGas } = collectionFactory;

    const estimatedGas = await estimateGas.createCollection(
      name,
      symbol,
      nonce
    );

    const gasLimit = calculateGasMargin(estimatedGas);

    // TODO: Make sure we pick the right gas price on mainnet
    // and make sure 1 works for Goerli
    const txOptions: Overrides = {
      gasLimit: gasLimit.toString(),
      // gasPrice: gasPrice,
    };

    console.log(collectionFactory);

    return await collectionFactory.createCollection(
      name,
      symbol,
      nonce,
      txOptions
    );
  }, options);
}

export function getCollectionFactory(signer: Signer | Provider) {
  return new Contract(
    getCollectionFactoryAddress(),
    CONTRACT_FACTORY_ABI,
    signer
  );
}

const CONTRACT_FACTORY_ABI: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
    ],
    name: 'createCollection',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
    ],
    name: 'predictCollectionAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
