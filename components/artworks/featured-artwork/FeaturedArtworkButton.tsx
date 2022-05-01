import NextLink from 'next/link';

import Link from 'components/base/Link';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Grid from 'components/base/Grid';
import GraySquare from 'components/base/GraySquare';

import { HandleSegmentEventFn } from './types';

interface FeaturedArtworkButtonProps {
  artworkPath: string;
  isLoading: boolean;
  handleSegmentEvent: HandleSegmentEventFn;
}

export default function FeaturedArtworkButton(
  props: FeaturedArtworkButtonProps
): JSX.Element {
  const { artworkPath, isLoading, handleSegmentEvent } = props;

  if (isLoading) {
    return <SkeletonLoadingBlock />;
  }

  return (
    <Grid
      css={{
        gridGap: '$4',
        gridTemplateColumns: 'auto',
        '@bp1': {
          maxWidth: 400,
        },
      }}
    >
      <NextLink href={artworkPath} passHref prefetch={false}>
        <Link
          onClick={() => handleSegmentEvent('view_artwork_button')}
          css={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <Button
            css={{ whiteSpace: 'nowrap', paddingX: '$8', width: '100%' }}
            color="black"
            size="large"
            shape="regular"
            hoverable
          >
            View artwork
          </Button>
        </Link>
      </NextLink>
    </Grid>
  );
}

function SkeletonLoadingBlock(): JSX.Element {
  return (
    <Grid
      css={{
        gridGap: '$4',
        gridTemplateColumns: 'auto',
        '@bp1': {
          maxWidth: 400,
        },
      }}
    >
      <Box>
        <GraySquare css={{ borderRadius: '$3', width: '100%', height: 60 }} />
      </Box>
    </Grid>
  );
}
