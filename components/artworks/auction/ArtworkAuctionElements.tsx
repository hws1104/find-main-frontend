import { ReactNode } from 'react';
import Grid from 'components/base/Grid';

interface ArtworkAuctionContainerProps {
  children: ReactNode;
}

export function ArtworkAuctionContainer(
  props: ArtworkAuctionContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Grid
      css={{
        gridGap: '$7',
        backgroundColor: '$white100',
        position: 'relative',
      }}
    >
      {children}
    </Grid>
  );
}

interface ArtworkAuctionMetaContainerProps {
  children: ReactNode;
  className?: string;
}

export function ArtworkAuctionMetaContainer(
  props: ArtworkAuctionMetaContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Grid
      css={{
        gridTemplateColumns: '1fr',
        gridColumnGap: '$6',
        gridRowGap: '$6',
        '@bp4': {
          gridTemplateColumns: 'auto 1fr',
          gridColumnGap: '$8',
        },
      }}
    >
      {children}
    </Grid>
  );
}
