import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventListed(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent } = props;

  return <HistoryEventGeneric label="Listed by" historyEvent={historyEvent} />;
}
