import {
  compose,
  map,
  prop,
  values,
  indexOf,
  sort,
  toLower,
  any,
  dissoc,
} from 'ramda';

import Account from 'types/Account';
import SocialLinkMap from 'types/SocialLink';

import { notEmptyOrNil } from './helpers';

export const getSocialHandles = compose(map(prop('handle')), values);

export const getHasSocialHandles = compose<
  SocialLinkMap,
  Omit<SocialLinkMap, 'instagram'>,
  Omit<SocialLinkMap, 'instagram' | 'twitter'>,
  string[],
  boolean
>(
  // are any hanldes present
  any(notEmptyOrNil),
  // get just the handles in an array
  getSocialHandles,
  // remove twitter from the links
  dissoc('twitter'),
  // remove instagram from the links
  dissoc('instagram')
);

type AccountUsername = Pick<Account, 'username'>;

export function sortCreatorsByUsernames<T extends AccountUsername>(
  creatorUsernames: string[],
  creators: T[]
): T[] {
  return sort<T>((a, b) => {
    const lowerCaseUsernames = map(toLower, creatorUsernames);
    const firstIndex = indexOf(toLower(a.username), lowerCaseUsernames);
    const secondIndex = indexOf(toLower(b.username), lowerCaseUsernames);
    return firstIndex - secondIndex;
  }, creators);
}
