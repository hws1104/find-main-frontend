export interface TabsProps<T> {
  currentView: T;
  setCurrentView: (arg1: T) => void;
  tabs: T[];
}

export enum ProfileTab {
  Created = 'Created',
  Collected = 'Owned',
  Splits = 'Splits',
  Collections = 'Collections',
  Hidden = 'Hidden',
}
