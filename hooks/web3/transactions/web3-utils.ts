import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import { getSplitContractToRead } from 'lib/contracts';

import { RevenueShare, ShareDataContract } from 'types/Share';

interface SplitCallDataArgs {
  splits: RevenueShare[];
  provider: JsonRpcProvider;
}

export function getSplitCallData(args: SplitCallDataArgs) {
  const { splits, provider } = args;

  const splitContractForCallData = getSplitContractToRead(provider);

  const sharesContract: ShareDataContract[] = splits.map((share) => {
    return {
      recipient: share.address,
      percentInBasisPoints: BigNumber.from(
        (share.shareInPercentage * 100).toFixed(0)
      ),
    };
  });

  const sharesContractSorted = sharesContract.sort(function (a, b) {
    const recipientA = a.recipient.toUpperCase(); // ignore upper and lowercase
    const recipientB = b.recipient.toUpperCase(); // ignore upper and lowercase
    if (recipientA < recipientB) {
      return -1;
    }
    if (recipientA > recipientB) {
      return 1;
    }
    // recipients must be equal (we shouldn't encounter this case)
    return 0;
  });

  return splitContractForCallData.interface.encodeFunctionData('createSplit', [
    sharesContractSorted,
  ]);
}
