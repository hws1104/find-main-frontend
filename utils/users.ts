/* eslint-disable max-lines */
import {
  compose,
  curry,
  nth,
  unnest,
  repeat,
  prop,
  ifElse,
  all,
  map,
  equals,
  complement,
  isNil,
  always,
  when,
  allPass,
  is,
  flatten,
  uniqBy,
  head,
} from 'ramda';
import { getAddress, isAddress } from '@ethersproject/address';

import { getUsernameOrAddressInfo, notEmptyOrNil } from 'utils/helpers';
import { maybeLowerCase } from 'utils/case';

import Account, { AccountFeed } from 'types/Account';

export const getUserFullName = when(notEmptyOrNil, prop('name'));

const getLastDigitFromString = (string: string): string =>
  string.match(/\d(?!.*\d)/)[0];

type AvatarGradient = [string, string];

export const gradients: AvatarGradient[] = [
  ['#54BCFB', '#4342F3'],
  ['#523FEF', '#FD22AD'],
  ['#FD22AD', '#ED5655'],
  ['#ED5356', '#F9D649'],
  ['#FFF61F', '#19FF3E'],
];

const getRepeatedGradients = compose<
  AvatarGradient[],
  AvatarGradient[][],
  AvatarGradient[]
>(unnest, (arr) => repeat(arr, 2));

export const repeatedGradients = getRepeatedGradients(gradients);

export const buildGradient = (from: string, to: string): string =>
  `linear-gradient(135deg, ${from}, ${to})`;

export const getAvatarFn = curry((gradients: any[], publicKey: string) => {
  const getIndex = ifElse(isNil, always('0'), getLastDigitFromString);
  const index = getIndex(publicKey);

  const boundIndex = Number(index) % gradients.length;

  const [gradientFrom, gradientTo] = nth(boundIndex, gradients);
  return buildGradient(gradientFrom, gradientTo);
});

export const getAvatarByPublicKey = getAvatarFn(repeatedGradients);

export const getProfilePageTitle = (user: Account): string => {
  const { usernameOrAddress, nameOrUsername, hasName } =
    getUsernameOrAddressInfo(user);

  if (hasName) {
    return `${nameOrUsername} (${usernameOrAddress})`;
  } else {
    return usernameOrAddress;
  }
};

// invert of isNil
const notNil = complement(isNil);

// returns true if all in array are not nil
const allNotNil = all(notNil);

// returns true if all not nil and all not equal
const allEqual = (items: unknown[]): boolean => {
  return all(equals(head(items)), items);
};

// combination of allNotNil and bothNotEqual
export const areKeysEqual = compose<string[], string[], boolean>(
  allPass([allNotNil, allEqual]),
  map(maybeLowerCase)
);

export const maybeGetAddress: (arg0: string) => string = when<string, string>(
  allPass([is(String), isAddress]),
  getAddress
);

export const mapGetAddress = map(maybeGetAddress);

export const maybeGetAddressOrEmpty: (arg0: string) => string = ifElse(
  allPass([is(String), isAddress]),
  getAddress,
  always('')
);

export const getCreators = compose<
  AccountFeed[][],
  AccountFeed[],
  AccountFeed[]
>(uniqBy(prop<string>('publicKey')), flatten);
