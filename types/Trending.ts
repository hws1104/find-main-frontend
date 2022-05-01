import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import Account from 'types/Account';

export type TrendingCreator = {
  oneDayVol: number;
  oneDayNumSold: number;
  oneDayCollectors: number;
  oneDayPrimaryVol: number;
  oneDaySecondaryVol: number;

  oneWeekVol: number;
  oneWeekNumSold: number;
  oneWeekCollectors: number;
  oneWeekPrimaryVol: number;
  oneWeekSecondaryVol: number;

  oneMonthVol: number;
  oneMonthNumSold: number;
  oneMonthCollectors: number;
  oneMonthPrimaryVol: number;
  oneMonthSecondaryVol: number;

  totalVol: number;
  totalNumSold: number;
  totalCollectors: number;
  totalPrimaryVol: number;
  totalSecondaryVol: number;

  user: Account;
};

export type TrendingCollector = {
  oneDayCreatorsSupported: number;
  oneDayNumBought: number;
  oneDaySpent: number;

  oneWeekCreatorsSupported: number;
  oneWeekNumBought: number;
  oneWeekSpent: number;

  oneMonthCreatorsSupported: number;
  oneMonthNumBought: number;
  oneMonthSpent: number;

  totalCreatorsSupported: number;
  totalNumBought: number;
  totalSpent: number;

  user: Account;
};

export type TrendingCollection = {
  oneDayVol: number;
  oneDayNumSold: number;
  oneDayCollectors: number;
  oneDayPrimaryVol: number;
  oneDaySecondaryVol: number;

  oneWeekVol: number;
  oneWeekNumSold: number;
  oneWeekCollectors: number;
  oneWeekPrimaryVol: number;
  oneWeekSecondaryVol: number;

  oneMonthVol: number;
  oneMonthNumSold: number;
  oneMonthCollectors: number;
  oneMonthPrimaryVol: number;
  oneMonthSecondaryVol: number;

  totalVol: number;
  totalNumSold: number;
  totalCollectors: number;
  totalPrimaryVol: number;
  totalSecondaryVol: number;

  collection: CollectionFragmentExtended;
};

export enum TimeFilter {
  OneDay,
  SevenDay,
  ThirtyDay,
  AllTime,
}

export enum TrendingCreatorColumn {
  UniqueCollectors = 'UniqueCollectors',
  NftsSold = 'NftsSold',
  PrimarySales = 'PrimarySales',
  SecondarySales = 'SecondarySales',
  TotalVolume = 'TotalVolume',
}

export enum TrendingCollectorColumn {
  CreatorsSupported = 'CreatorsSupported',
  NftsBought = 'NftsBought',
  TotalSpent = 'TotalSpent',
}

export enum TrendingCollectionColumn {
  Owners = 'Owners',
  NftsSold = 'NftsSold',
  PrimarySales = 'PrimarySales',
  SecondarySales = 'SecondarySales',
  TotalSales = 'TotalSales',
}
