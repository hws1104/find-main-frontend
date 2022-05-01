import Box from 'components/base/Box';
import Card from 'components/base/Card';
import GraySquare from 'components/base/GraySquare';
import AspectRatio from 'components/base/AspectRatio';
import ArtworkCardTitleContainer from './subcomponents/ArtworkCardTitleContainer';
import ArtworkCardHeader from './subcomponents/ArtworkCardHeader';

type ArtworkCardType = 'regular' | 'detailed';

interface ArtworkCardSkeletonProps {
  cardType?: ArtworkCardType;
}

export default function ArtworkCardSkeleton(
  props: ArtworkCardSkeletonProps
): JSX.Element {
  const { cardType = 'detailed' } = props;

  return (
    <Card
      css={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        pointerEvents: 'none',
      }}
    >
      <GraySquare
        css={{
          height: 68,
          width: '100%',
          background: '$white100',
          borderTopLeftRadius: '$2',
          borderTopRightRadius: '$2',
        }}
      />
      <AspectRatio
        ratio={1}
        css={{
          backgroundColor: '$black5',
        }}
      />
      <ArtworkCardHeader>
        <GraySquare css={{ height: 35, maxWidth: 140, width: '100%' }} />
        <GraySquare css={{ height: 35, width: '80%' }} />
      </ArtworkCardHeader>
      {cardType === 'detailed' && (
        <Box
          css={{
            borderBottomLeftRadius: '$2',
            borderBottomRightRadius: '$2',
            padding: '$6',
            justifyContent: 'space-between',
            backgroundColor: '$black5',
            height: 89,
          }}
        />
      )}
    </Card>
  );
}

export function ArtworkCardSkeletonMinimal(): JSX.Element {
  return (
    <Card
      css={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        pointerEvents: 'none',
      }}
    >
      <AspectRatio ratio={1} css={{ backgroundColor: '$black5' }} />
      <ArtworkCardTitleContainer>
        <GraySquare css={{ height: 29, width: 240 }} />
        <GraySquare css={{ height: 32, width: 180 }} />
      </ArtworkCardTitleContainer>
    </Card>
  );
}
