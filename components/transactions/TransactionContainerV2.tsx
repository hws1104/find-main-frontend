import { ReactNode } from 'react';
import { styled } from 'stitches.config';

import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

import { CardVariant } from 'types/Card';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

export const TransactionFormContainer = styled(Body, {
  display: 'block',
  flex: 'auto',
  alignItems: 'center',
  maxWidth: 1080,
  '@bp1': {
    display: 'grid',
  },
});

interface TransactionContainerProps<T> {
  children: ReactNode;
  artwork: T;
  cardVariant?: CardVariant;
}

export default function TransactionContainerV2<
  T extends ArtworkFragmentExtended
>(props: TransactionContainerProps<T>): JSX.Element {
  const { artwork, children, cardVariant = CardVariant.default } = props;

  return (
    <Flex
      css={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginX: 'auto',
        gap: 0,
        justifyContent: 'center',
        '@bp1': {
          display: 'grid',
          gridTemplateColumns: `340px 400px`,
          gap: '$10',
          justifyContent: 'flex-start',
        },
      }}
      className="transaction-container"
    >
      <Box
        className="transaction-card"
        css={{ display: 'none', '@bp1': { display: 'block' } }}
      >
        <Box css={{ maxWidth: 340, '@bp1': { maxWidth: 'none' } }}>
          {cardVariant === CardVariant.minimal ? (
            <ArtworkCardMinimal artwork={artwork} creator={artwork?.creator} />
          ) : (
            <ArtworkCard
              artwork={artwork}
              creator={artwork?.creator}
              currentUser={null}
            />
          )}
        </Box>
      </Box>

      <Box
        className="transaction-content"
        css={{
          paddingX: '$6',
          paddingBottom: '$7',
          '@bp1': { paddingX: 0, paddingBottom: 0 },
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
