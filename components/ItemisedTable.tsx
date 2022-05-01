import Box from './base/Box';
import Grid from './base/Grid';
import Flex from './base/Flex';
import Text from './base/Text';

import { styled } from 'stitches.config';

const LineItem = styled(Text, {
  fontWeight: 600,
  color: '$black60',
});

type ItemisedItemType = 'standard' | 'total';

export type ItemisedItem = {
  label: string;
  value: string;
  type?: ItemisedItemType;
};

interface ItemisedTableProps {
  items: ItemisedItem[];
}

export default function ItemisedTable(props: ItemisedTableProps): JSX.Element {
  const { items } = props;

  const standardLineItems = items.filter(
    (item) => item.type === 'standard' || !item.type
  );

  const totalLineItems = items.filter((item) => item.type === 'total');

  return (
    <Box>
      <Grid
        css={{
          gap: '$3',
          borderBottom: '1px solid $black10',
          paddingBottom: '$5',
          marginBottom: '$5',
        }}
      >
        {standardLineItems.map((item) => (
          <Flex key={item.label}>
            <LineItem>{item.label}</LineItem>
            <LineItem
              css={{ color: '$black100', marginLeft: 'auto', fontSize: '$2' }}
            >
              {item.value}
            </LineItem>
          </Flex>
        ))}
      </Grid>

      {totalLineItems.map((item) => (
        <Flex key={item.label} css={{ alignItems: 'center' }}>
          <LineItem>{item.label}</LineItem>
          <LineItem
            css={{
              fontSize: '$3',
              color: '$black100',
              marginLeft: 'auto',
            }}
          >
            {item.value}
          </LineItem>
        </Flex>
      ))}
    </Box>
  );
}
