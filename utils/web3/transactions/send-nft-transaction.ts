/* eslint-disable max-lines */
import {
  getNFT721Contract,
  getNFT721ContractToRead,
  getNFTMarketContract,
  getNFTMarketContractToRead,
} from 'lib/contracts';

import { calculateGasMargin } from 'utils/gas';
import {
  SendMarketTxResponse,
  TransferParams,
  UnlistParams,
  BurnParams,
  ChangePriceParams,
} from 'types/NFTMarketInterface';

// TODO: Have a separate tx or an arg to handle mint vs. mintAndApproveMarket

export async function sendNFTTransferTransaction({
  provider,
  estimateGasProvider,
  gasData,
  from,
  to,
  tokenId,
  contractAddress,
}: TransferParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract({ signer, contractAddress });

  const signerAddress = await signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead({
    provider: estimateGasProvider,
    contractAddress,
  });

  const estimatedGas = await nft721ContractForEstimation.estimateGas[
    'safeTransferFrom(address,address,uint256)'
  ](from, to, tokenId, { from: signerAddress });

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nft721Contract['safeTransferFrom(address,address,uint256)'](
    from,
    to,
    tokenId,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTBurnTransaction({
  provider,
  estimateGasProvider,
  tokenId,
  contractAddress,
}: BurnParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nft721Contract = getNFT721Contract({ signer, contractAddress });

  const signerAddress = await signer.getAddress();

  const nft721ContractForEstimation = getNFT721ContractToRead({
    provider: estimateGasProvider,
    contractAddress,
  });

  const estimatedGas = await nft721ContractForEstimation.estimateGas.burn(
    tokenId,
    { from: signerAddress }
  );

  const gasLimit = calculateGasMargin(estimatedGas);

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nft721Contract.burn(tokenId, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketUnlistTransaction({
  provider,
  estimateGasProvider,
  auctionId,
}: UnlistParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = await signer.getAddress();

  const nftMarketContractForEstimation =
    getNFTMarketContractToRead(estimateGasProvider);

  const estimatedGas =
    await nftMarketContractForEstimation.estimateGas.cancelReserveAuction(
      auctionId,
      { from: signerAddress }
    );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.cancelReserveAuction(auctionId, txOptions);

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}

export async function sendNFTMarketChangePriceTransaction({
  provider,
  estimateGasProvider,
  // gasData,
  auctionId,
  reservePrice,
}: ChangePriceParams): Promise<SendMarketTxResponse> {
  const signer = provider.getSigner();

  // Note: It's not in scope for this function to check
  // if the user has enough ETH before sending the tx
  // The component using this function should do
  // that if appropriate

  const nftMarketContract = getNFTMarketContract(signer);

  const signerAddress = await signer.getAddress();

  const nftMarketContractForEstimation =
    getNFTMarketContractToRead(estimateGasProvider);

  const estimatedGas =
    await nftMarketContractForEstimation.estimateGas.updateReserveAuction(
      auctionId,
      reservePrice,
      { from: signerAddress }
    );

  const gasLimit = calculateGasMargin(estimatedGas);

  // TODO: Make sure we pick the right gas price on mainnet
  // and make sure 1 works for Goerli

  // const gasPrice = gasData?.gasPrice;
  const txOptions = {
    gasLimit: gasLimit.toString(),
    // gasPrice: gasPrice,
  };

  const tx = await nftMarketContract.updateReserveAuction(
    auctionId,
    reservePrice,
    txOptions
  );

  // Note: The consumer of this function
  // is responsible for waiting for 1 confirmation if they desire
  const { hash: txHash } = tx;
  return {
    tx,
    txHash,
  };
}
