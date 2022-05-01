import {
  getNFTMarketAddress,
  getNFT721Address,
  getSplitAddress,
} from 'lib/addresses';
import { Signer } from '@ethersproject/abstract-signer';
import { JsonRpcProvider } from '@ethersproject/providers';

import {
  FNDNFT721__factory,
  FNDNFTMarket__factory,
  FNDNFTMarket,
  FNDNFT721,
  PercentSplitETH,
  PercentSplitETH__factory,
} from 'types/contracts';
import { isAllTrue } from 'utils/helpers';

const nftMarketAddr = getNFTMarketAddress();
const nft721Addr = getNFT721Address();
const splitAddr = getSplitAddress();

type ContractMap<T> = Record<string, T>;

// contracts are now 1 of n so we cache them by address
const nft721Contract: ContractMap<FNDNFT721> = {};
const nft721ContractToRead: ContractMap<FNDNFT721> = {};
// these contracts are 1 of 1
let nftMarketContract: FNDNFTMarket;
let nftMarketContractToRead: FNDNFTMarket;
let splitContractToRead: PercentSplitETH;

export function getNFTMarketContract(signer: Signer): FNDNFTMarket {
  const canAssignContract = isAllTrue([!nftMarketContract, signer]);

  if (canAssignContract) {
    nftMarketContract = FNDNFTMarket__factory.connect(nftMarketAddr, signer);
  }
  return nftMarketContract;
}

export function getNFTMarketContractToRead(
  provider: JsonRpcProvider
): FNDNFTMarket {
  const canAssignContract = isAllTrue([!nftMarketContractToRead, provider]);

  if (canAssignContract) {
    nftMarketContractToRead = FNDNFTMarket__factory.connect(
      nftMarketAddr,
      provider
    );
  }
  return nftMarketContractToRead;
}

interface GetNFT721ContractArgs {
  signer: Signer;
  contractAddress?: string;
}

export function getNFT721Contract({
  signer,
  contractAddress = nft721Addr,
}: GetNFT721ContractArgs): FNDNFT721 {
  const contract = nft721Contract[contractAddress];

  const canAssignContract = isAllTrue([!contract, signer, contractAddress]);

  if (canAssignContract) {
    nft721Contract[contractAddress] = FNDNFT721__factory.connect(
      contractAddress,
      signer
    );
  }
  return nft721Contract[contractAddress];
}

interface GetNFT721ContractToReadArgs {
  provider: JsonRpcProvider;
  contractAddress: string;
}

export function getNFT721ContractToRead({
  provider,
  contractAddress,
}: GetNFT721ContractToReadArgs): FNDNFT721 {
  const contract = nft721ContractToRead[contractAddress];

  const canAssignContract = isAllTrue([!contract, provider, contractAddress]);

  if (canAssignContract) {
    nft721ContractToRead[contractAddress] = FNDNFT721__factory.connect(
      contractAddress,
      provider
    );
  }
  return nft721ContractToRead[contractAddress];
}

export function getSplitContractToRead(
  provider: JsonRpcProvider
): PercentSplitETH {
  const canAssignContract = isAllTrue([!splitContractToRead, provider]);

  if (canAssignContract) {
    splitContractToRead = PercentSplitETH__factory.connect(splitAddr, provider);
  }
  return splitContractToRead;
}
