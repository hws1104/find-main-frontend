import { ReactNode } from 'react';

import Grid from 'components/base/Grid';

interface ArtworkCardTitleContainerProps {
  children: ReactNode;
}

export default function ArtworkCardTitleContainer(
  props: ArtworkCardTitleContainerProps
): JSX.Element {
  const { children } = props;

  return (
    <Grid
      css={{
        boxShadow: '$0',
        padding: '$6',
        flex: 'auto',
        gap: '$5',
      }}
    >
      {children}
    </Grid>
  );
}
