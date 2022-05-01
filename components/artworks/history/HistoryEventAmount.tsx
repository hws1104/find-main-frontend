import Flex from 'components/base/Flex';
import Text from 'components/base/Text';

import { formatETHWithSuffix } from 'utils/formatters';

interface HistoryEventAmountProps {
  amountInETH: string;
}

export default function HistoryEventAmount(
  props: HistoryEventAmountProps
): JSX.Element {
  const { amountInETH } = props;

  return (
    <Flex css={{ order: 1, '@bp0': { alignItems: 'center', order: 2 } }}>
      <Flex
        css={{
          textAlign: 'right',
          justifyContent: 'space-between',
          flex: 1,
          '@bp0': { flexDirection: 'column' },
        }}
      >
        <Text
          size={{ '@initial': 1, '@bp0': 2 }}
          weight={600}
          css={{ whiteSpace: 'pre' }}
        >
          {formatETHWithSuffix(amountInETH)}
        </Text>
      </Flex>
    </Flex>
  );
}
