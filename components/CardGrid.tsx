import { styled } from 'stitches.config';
import Grid from './base/Grid';

const CardGrid = styled(Grid, {
  gridGap: '$4',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  '@bp0': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  },
  '@bp2': {
    gridGap: '$6',
  },
  '@bp4': {
    gridGap: '$7',
  },
});

export default CardGrid;
