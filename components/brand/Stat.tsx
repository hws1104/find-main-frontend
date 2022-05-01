import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import ETHinUSD from 'components/ETHinUSD';

interface StatProps {
  description: string;
  stat: string | number;
  forUSD?: number;
}
export default function Stat(props: StatProps): JSX.Element {
  const { description, stat, forUSD } = props;
  return (
    <Box
      css={{
        borderTop: '1px solid $black20',
        paddingY: '$6',

        '&:last-of-type': {
          borderBottom: '1px solid $black20',
        },
        '@bp1': {
          height: 140,
        },
      }}
    >
      <Grid
        css={{
          gridGap: '$6',
          '@bp1': {
            gridTemplateColumns: '1fr 1fr',
          },
        }}
      >
        <Text
          size={2}
          weight={600}
          css={{ fontFamily: '$body', maxWidth: 250 }}
        >
          {description}
        </Text>
        <Flex expandVertical>
          <Text size={4} weight={600}>
            {stat}
          </Text>
          {forUSD && (
            <Text size={2} css={{ color: '$black60', marginTop: '$4' }}>
              <ETHinUSD amount={forUSD} />
            </Text>
          )}
        </Flex>
      </Grid>
    </Box>
  );
}
