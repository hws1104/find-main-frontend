import Grid from 'components/base/Grid';
import { styled } from 'stitches.config';

const FormGrid = styled(Grid, {
  gap: '$6',
  paddingTop: '$6',
  paddingBottom: '$6',

  '@bp0': {
    paddingTop: '$7',
    paddingBottom: '$7',
  },
  '@bp1': {
    paddingTop: '$9',
    paddingBottom: '$9',
    paddingX: '$8',
  },
  '@bp2': {
    paddingTop: '$10',
    paddingBottom: '$10',
  },
  '@bp3': {
    paddingBottom: '$11',
  },
});

export default FormGrid;
