import ActivityEmptyState from 'components/activity/ActivityEmptyState';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function BidsEmptyState() {
  return (
    <ActivityEmptyState
      title="No activity to show yet"
      description="Your auction and private sale activity will show up here."
    />
  );
}
