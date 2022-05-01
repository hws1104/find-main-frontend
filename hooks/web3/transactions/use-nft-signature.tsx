import { useWeb3React } from '@web3-react/core';
import { useMutation } from 'react-query';
import { Web3Provider } from '@ethersproject/providers';
import getChainId from 'lib/chainId';
import { getNFTMarketAddress } from 'lib/addresses';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import { BigNumberish } from '@ethersproject/bignumber';
import { toBNFixed } from 'utils/numbers';

interface CreatePrivateSaleParams {
  buyerAddress: string;
  tokenId: BigNumberish;
  contractAddress: string;
  price: number;
  deadline: number;
}

const domain = {
  name: 'FNDNFTMarket',
  version: '1',
  chainId: getChainId(),
  verifyingContract: getNFTMarketAddress(),
};

// The named list of all type definitions
const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  BuyFromPrivateSale: [
    { name: 'nftContract', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'buyer', type: 'address' },
    { name: 'price', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

export function useCreatePrivateSaleSignature() {
  const { data: user } = useWalletSession();
  const { library: provider } = useWeb3React<Web3Provider>();

  const publicAddress = user?.publicAddress;

  return useMutation(async (params: CreatePrivateSaleParams) => {
    const { buyerAddress, tokenId, contractAddress, price, deadline } = params;

    if (!provider) {
      throw Error('No Provider Error');
    }

    const value = {
      nftContract: contractAddress,
      tokenId: tokenId,
      buyer: buyerAddress,
      price: toBNFixed(price),
      deadline,
    };

    const typedData = JSON.stringify(
      {
        types: types,
        primaryType: 'BuyFromPrivateSale',
        domain: domain,
        message: value,
      },
      null,
      2
    );

    const payload = [publicAddress, typedData];

    return await provider.send('eth_signTypedData_v4', payload);
  });
}
