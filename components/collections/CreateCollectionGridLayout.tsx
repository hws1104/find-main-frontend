import Box from 'components/base/Box';
import { TransactionLayoutGrid } from 'components/layouts/TransactionLayoutV2';
import CollectionCardBlueprint from './CollectionCardBlueprint';

interface CreateCollectionGridLayoutProps {
  children: JSX.Element;
  symbol: string;
  name: string;
}

export default function CreateCollectionGridLayout(
  props: CreateCollectionGridLayoutProps
): JSX.Element {
  const { children, symbol, name } = props;
  return (
    <TransactionLayoutGrid>
      {children}
      <Box>
        <CollectionCardBlueprint symbol={symbol} name={name} />
      </Box>
    </TransactionLayoutGrid>
  );
}
