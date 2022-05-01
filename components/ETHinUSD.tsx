import useETHPrice from 'hooks/queries/use-eth-price';

import { formatCurrencyRaw } from 'utils/formatters';
import { isAnyTrue } from 'utils/helpers';

import Text from 'components/base/Text';

const getParsedNumber = (number) => {
  return parseFloat(number);
};

interface ETHinUSDProps {
  amount: string | number;
}

export default function ETHinUSD(props: ETHinUSDProps): JSX.Element {
  const { amount } = props;

  const { data: priceData, isLoading, isError } = useETHPrice();

  const isLoadingVisible = isAnyTrue([isLoading, isError, !priceData]);

  if (isLoadingVisible) {
    return (
      <Text as="span" css={{ opacity: 0 }}>
        —
      </Text>
    );
  }

  const parsedAmount = getParsedNumber(amount);

  return <>{formatCurrencyRaw(parsedAmount * priceData)}</>;
}
