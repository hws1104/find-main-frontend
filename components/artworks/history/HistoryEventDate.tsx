import Text from 'components/base/Text';
import { formatBidDateShort } from 'utils/dates/dates';

interface HistoryEventDateProps {
  date: string;
}

export default function HistoryEventDate(
  props: HistoryEventDateProps
): JSX.Element {
  const { date } = props;

  return (
    <Text size={0} css={{ color: '$black60' }}>
      {formatBidDateShort(date)}
    </Text>
  );
}
