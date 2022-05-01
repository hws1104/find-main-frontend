import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatEther, parseUnits } from '@ethersproject/units';
import { compose } from 'ramda';

export const fromBNDec = compose<BigNumber, string, number>(
  Number,
  formatEther
);

export const toBNFixed = (n: BigNumberish): string => {
  const value = n.toString();
  return parseUnits(value).toString();
};

// ignores 0 and null values when searching for a min in an array
export const nonZeroMin = (values: number[]): number | null => {
  return values.reduce((acc, curr) => {
    // If value is null or 0 return the accumulator
    if (!curr || curr === 0) {
      return acc;
    }
    // if the value is a positive number check to see if it smaller than the accumulator
    if (curr < acc) {
      return curr;
    }
    return acc;
  });
};
