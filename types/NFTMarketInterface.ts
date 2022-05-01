import { BigNumberish } from '@ethersproject/bignumber';
import { ContractTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

// Note: Finalize flow uses Claim enum option here since
// the smart contract method is the same
export enum MethodEnum {
  Transfer = 'safeTransferFrom',
  Unlist = 'cancelReserveAuction',
  ChangePrice = 'updateReserveAuction',
  Burn = 'burn',
}

export interface SendNFTTransactionTransferParams {
  from: string;
  to: string;
  tokenId: BigNumberish;
  contractAddress: string;
}

export interface SendNFTTransactionBurnParams {
  tokenId: BigNumberish;
  contractAddress: string;
}

export interface SendMarketTransactionListParams {
  contractAddress: string;
  tokenId: BigNumberish;
  reservePrice: BigNumberish;
}

export interface SendMarketTransactionChangePriceParams {
  auctionId: BigNumberish;
  reservePrice: BigNumberish;
}

export interface SendMarketTransactionUnlistParams {
  auctionId: BigNumberish;
}

// Note: No such thing as SendNFTTransactionApproveParams
// since it would be {} which doesn't warrant creating an interface

export interface SendMarketTxResponse {
  tx: ContractTransaction;
  txHash: string;
}

export interface SendTransactionSharedParams {
  provider: JsonRpcProvider;
  estimateGasProvider: JsonRpcProvider;
  gasData?: any;
}

export interface TransferParams
  extends SendTransactionSharedParams,
    SendNFTTransactionTransferParams {}

export interface BurnParams
  extends SendTransactionSharedParams,
    SendNFTTransactionBurnParams {}

export interface ChangePriceParams
  extends SendTransactionSharedParams,
    SendMarketTransactionChangePriceParams {}

export interface UnlistParams
  extends SendTransactionSharedParams,
    SendMarketTransactionUnlistParams {}
