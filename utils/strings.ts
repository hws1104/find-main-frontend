import {
  compose,
  when,
  is,
  split,
  last,
  head,
  includes,
  replace,
  startsWith,
  toString,
  propOr,
  cond,
  equals,
  curry,
  T,
  always,
  anyPass,
} from 'ramda';
import { notEmptyOrNil } from './helpers';

const isNumber = is(Number);
const isObject = is(Object);

export const maybeToString: (arg0: unknown) => string = when(
  anyPass([isNumber, isObject]),
  toString
);

const getPathFromUrl = when(
  // when it includes a query param
  includes('?'),
  // split by the question mark and take the first part
  compose(head, split('?'))
);

export const getSocialHandle = when(
  notEmptyOrNil,
  compose(
    // get last part
    last,
    // split by slash
    split('/'),
    // remove trailing slash
    replace(/\/$/, ''),
    // get rid of query params
    getPathFromUrl
  )
);

export const stripAtSymbol = when(startsWith('@'), replace('@', ''));

export const getInstagramHandle = compose(
  when(notEmptyOrNil, stripAtSymbol),
  getSocialHandle
);

export const propOrEmptyString = (propName: string) => propOr('', propName);

export const pluralizeWord = curry((word: string, count: number) =>
  cond([
    [equals(1), always(word)],
    [T, always(`${word}s`)],
  ])(count)
);
