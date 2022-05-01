import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';

interface HeaderActivityCountProps {
  count: number;
}

export default function HeaderActivityCount(
  props: HeaderActivityCountProps
): JSX.Element {
  const { count } = props;
  return (
    <Grid css={{ marginLeft: '$3' }}>
      <Box
        className="number-bg"
        css={{
          borderRadius: '$round',
          overflow: 'hidden',
          gridRow: 1,
          gridColumn: 1,
          background: '$black10',
          transition: 'background $1 $ease',
        }}
      />
      <Text
        className="number"
        size={2}
        css={{
          display: 'flex',
          gridRow: 1,
          gridColumn: 1,
          minWidth: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingX: 6,
          top: -1,
          color: '$black100',
          transition: 'color $0 $ease',
        }}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </Grid>
  );
}
