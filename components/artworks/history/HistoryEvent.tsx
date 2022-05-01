import { cond, curry, pathEq, T } from 'ramda';

import { HistoryEventProps } from './types';

import HistoryEventMinted from 'components/artworks/history/HistoryEventMinted';
import HistoryEventListed from 'components/artworks/history/HistoryEventListed';
import HistoryEventBid from 'components/artworks/history/HistoryEventBid';
import HistoryEventSold from 'components/artworks/history/HistoryEventSold';
import HistoryEventSettled from 'components/artworks/history/HistoryEventSettled';
import HistoryEventTransferred from 'components/artworks/history/HistoryEventTransferred';
import HistoryEventReserveChanged from 'components/artworks/history/HistoryEventReserveChanged';
import HistoryEventUnlisted from 'components/artworks/history/HistoryEventUnlisted';
import HistoryEventPrivateSale from 'components/artworks/history/HistoryEventPrivateSale';
import { EventType } from 'types/Event';

const eventStatusEq = curry(
  (event: EventType, historyItem: HistoryEventProps) =>
    pathEq(['historyEvent', 'eventType'], event, historyItem)
);

// the history events we want to render and to which components
const renderHistoryItem = cond<HistoryEventProps, JSX.Element>([
  [(props) => eventStatusEq(EventType.Minted, props), HistoryEventMinted],
  [(props) => eventStatusEq(EventType.Listed, props), HistoryEventListed],
  [(props) => eventStatusEq(EventType.Bid, props), HistoryEventBid],
  [(props) => eventStatusEq(EventType.Sold, props), HistoryEventSold],
  [
    (props) => eventStatusEq(EventType.PrivateSale, props),
    HistoryEventPrivateSale,
  ],
  [(props) => eventStatusEq(EventType.Settled, props), HistoryEventSettled],
  [
    (props) => eventStatusEq(EventType.Transferred, props),
    HistoryEventTransferred,
  ],
  [
    (props) => eventStatusEq(EventType.PriceChanged, props),
    HistoryEventReserveChanged,
  ],
  [(props) => eventStatusEq(EventType.Unlisted, props), HistoryEventUnlisted],
  [T, () => null],
]);

export default function ProvenanceEvent(props: HistoryEventProps): JSX.Element {
  return renderHistoryItem(props);
}
