/* eslint-disable react/jsx-max-depth */
import Card from 'components/base/Card';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import AspectRatio from 'components/base/AspectRatio';
import GraySquare from 'components/base/GraySquare';

export default function CreatorCardSkeleton(): JSX.Element {
  return (
    <Card
      css={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <Box css={{ position: 'relative' }}>
        <AspectRatio
          ratio={1.75}
          css={{ backgroundColor: '$black5', display: 'flex' }}
        />
        <Box css={{ marginX: '$6', position: 'relative' }}>
          <Box
            css={{
              padding: '$0',
              backgroundColor: '$black10',
              width: 96,
              height: 96,
              position: 'absolute',
              left: 0,
              transform: 'translateY(-50%)',
              display: 'flex',
              borderRadius: '$round',
            }}
          />
        </Box>
      </Box>
      <Box css={{ paddingX: '$6', paddingTop: '$9', paddingBottom: '$8' }}>
        <Grid css={{ gap: 5, marginBottom: '$4' }}>
          <GraySquare css={{ height: 39, width: 150, background: '$black5' }} />
          <GraySquare css={{ height: 26, width: 100, background: '$black5' }} />
        </Grid>
        <GraySquare
          css={{ height: 75, width: '100%', background: '$black5' }}
        />
      </Box>
    </Card>
  );
}
