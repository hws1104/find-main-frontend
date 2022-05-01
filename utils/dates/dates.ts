/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import format from 'date-fns/fp/format';
import parseISO from 'date-fns/fp/parseISO';
import isBefore from 'date-fns/fp/isBefore';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseJSON,
  getUnixTime,
  addHours,
} from 'date-fns/fp';

import {
  replace,
  complement,
  isNil,
  when,
  lte,
  prop,
  is,
  dropWhile,
  compose,
  curry,
  gt,
  ifElse,
  always,
  cond,
  gte,
  T,
  anyPass,
  lt,
  equals,
} from 'ramda';

import { CountdownPart } from 'hooks/use-countdown';

import { ArtworkAuctionBidActionProps } from 'components/artworks/auction/types';
import { isEmptyOrNil, notEmptyOrNil } from 'utils/helpers';

export const parseUnixTimestamp = compose<number, number, number>(
  // multiply by 1000 as timestamps come through in seconds
  (date) => date * 1000,
  Number
);
interface CalculateInitialDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeDifferenceInParts = (
  endDate: number
): CalculateInitialDuration => {
  const nowUnix = Date.now();
  const futureDate = parseUnixTimestamp(endDate);

  const days = differenceInDays(nowUnix, futureDate);
  const hours = differenceInHours(nowUnix, futureDate) % 24;
  const minutes = differenceInMinutes(nowUnix, futureDate) % 60;
  const seconds = differenceInSeconds(nowUnix, futureDate) % 60;
  return { days, hours, minutes, seconds };
};

export const postedOn = compose(format('d MMMM yyyy'), parseISO);
export const lastUpdated = compose(format('MMMM d, yyyy'), parseISO);

// inverts the isNil check
const notNil = complement(isNil);

// Convert a string to a number, get a js date
// from unix time in seconds, then compare it with
// the current js date
export const isUnixDateInPast = (dateUnix: number): boolean => {
  const nowUnix = Date.now();
  const isBeforeNow = compose(isBefore(nowUnix), parseUnixTimestamp);

  const result = when(notNil, isBeforeNow, dateUnix);

  return result;
};

const isString = is(String);
const isNumber = is(Number);

// when the 'value' prop is <= 0 return true
const isValueNotZero = (num: number) => lte(num, 0);

// drop values that equal 0 from start of array
export const getTimeDifferenceParts = dropWhile<CountdownPart>(
  compose<CountdownPart, number, boolean>(
    anyPass([isValueNotZero, isNaN, isEmptyOrNil]),
    prop('value')
  )
);

export const getMinutesRemaining = (unixTimestamp: number): number =>
  ifElse(
    anyPass([isString, isNumber]),
    compose(differenceInMinutes(Date.now()), parseUnixTimestamp),
    always(Infinity)
  )(unixTimestamp);

export const whenMinsLessThan = curry(
  (
    minutes: number,
    data: Pick<ArtworkAuctionBidActionProps, 'minutesRemaining'>
  ): boolean => {
    return compose(gt(minutes), prop('minutesRemaining'))(data);
  }
);

export const formatDateJoined = compose(format('MMMM yyyy'), parseJSON);

export function formatRelativeTimestamp(timestamp: string): string {
  const eventDate = new Date(`${timestamp}Z`);
  const now = new Date();
  const diffInSecs = differenceInSeconds(eventDate, now);

  return cond([
    // Less than or a minute
    [gte(60), always('1m')],
    // Less than 60 minutes
    [gt(3600), (seconds) => `${Math.floor(seconds / 60)}m`],
    // Less 24 hours
    [gt(86400), (seconds) => `${Math.floor(seconds / 60 / 60)}h`],
    // Older than 24 hours
    [T, () => format('MMM d')(eventDate)],
  ])(diffInSecs);
}

export const parseDateToUnix: (arg0: string) => number = when(
  notEmptyOrNil,
  compose<string, Date, number>(getUnixTime, parseJSON)
);

export const formatBidDateShort = when(
  anyPass([isString]),
  compose(
    // remove periods in the a.m. and p.m. formatting
    replace(/[.]/g, ''),
    // Jan 22, 2021 at 2:41p.m.
    format(`MMM d, yyyy 'at' h:mmaaaa`),
    // parse the date from json
    parseJSON,
    // Add Z to convert this into a UTC timezone timestamp, parseISO then treats it as such
    (date: string) => `${date}Z`
  )
);

export const formatDateOnlyShort: (arg0: string) => string = when(
  anyPass([isString]),
  compose(
    // Jan 22, 2021
    format('MMM d, yyyy'),
    // parse the date from json
    parseJSON
  )
);

enum TimeUnit {
  // 1 year in mins
  year = 525600,
  // 1 month in mins
  month = 43800,
  // 1 day in mins
  day = 1440,
  // 1 hour in mins
  hour = 60,
  // otherwise format as mins
  minute = 1,
}

type TimeFormat = 'long' | 'short';

const pluralizeTimeAgo = curry(
  (timeUnit: string, format: TimeFormat, timeAgo: number, _) => {
    const isAbbr = format === 'short';

    if (isAbbr) {
      return timeAgo + timeUnit;
    }

    return cond([
      [equals(1), (timeAgo) => `${timeAgo} ${timeUnit} ago`],
      [T, (timeAgo) => `${timeAgo} ${timeUnit}s ago`],
    ])(timeAgo);
  }
);

const calculateTimeDifference = curry(
  (timeUnit: TimeUnit, format: TimeFormat, diffInMins: number) => {
    const timeAgo = Math.round(diffInMins / timeUnit);

    const isAbbr = format === 'short';

    return cond([
      [
        equals(TimeUnit.year),
        pluralizeTimeAgo(isAbbr ? 'y' : 'year', format, timeAgo),
      ],
      [
        equals(TimeUnit.month),
        pluralizeTimeAgo(isAbbr ? 'm' : 'month', format, timeAgo),
      ],
      [
        equals(TimeUnit.day),
        pluralizeTimeAgo(isAbbr ? 'd' : 'day', format, timeAgo),
      ],
      [
        equals(TimeUnit.hour),
        pluralizeTimeAgo(isAbbr ? 'h' : 'hour', format, timeAgo),
      ],
      [
        equals(TimeUnit.minute),
        pluralizeTimeAgo(isAbbr ? 'm' : 'minute', format, timeAgo),
      ],
    ])(timeUnit);
  }
);

export function timeAgoInWords(timestamp: string, format: TimeFormat): string {
  const unixDate = parseDateToUnix(timestamp);
  const minsAgo = differenceInMinutes(unixDate * 1000, Date.now());

  return cond([
    [lt(TimeUnit.year), calculateTimeDifference(TimeUnit.year, format)],
    [lt(TimeUnit.month), calculateTimeDifference(TimeUnit.month, format)],
    [lt(TimeUnit.day), calculateTimeDifference(TimeUnit.day, format)],
    [lt(TimeUnit.hour), calculateTimeDifference(TimeUnit.hour, format)],
    [T, calculateTimeDifference(TimeUnit.minute, format)],
  ])(minsAgo);
}

export const add24hoursTimestamp = (date = Date.now()): number => {
  return getUnixTime(addHours(24, date));
};
