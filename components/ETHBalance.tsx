import Flex from 'components/base/Flex';
import Text from 'components/base/Text';

interface ETHBalanceProps {
  balance: string | number;
  formatter: (arg0: unknown) => string;
}

export default function ETHBalance(props: ETHBalanceProps): JSX.Element {
  const { balance, formatter } = props;

  return (
    <Flex
      css={{
        borderRadius: '$3',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingY: '$6',
        paddingX: '$5',
        backgroundColor: '$black10',
      }}
    >
      <Text weight={600} size={1} css={{ color: '$black60' }}>
        Your Balance
      </Text>

      <Text weight={600} size={2}>
        {formatter(balance)}
      </Text>
    </Flex>
  );
}
