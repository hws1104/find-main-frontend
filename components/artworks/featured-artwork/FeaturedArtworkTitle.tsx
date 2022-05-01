import NextLink from 'next/link';

import Link from 'components/base/Link';
import Heading from 'components/base/Heading';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { HandleSegmentEventFn } from './types';

interface FeaturedArtworkTitleProps {
  artworkPath: string;
  artwork: ArtworkFragmentExtended;
  handleSegmentEvent: HandleSegmentEventFn;
}

export default function FeaturedArtworkTitle(
  props: FeaturedArtworkTitleProps
): JSX.Element {
  const { artwork, artworkPath, handleSegmentEvent } = props;

  return (
    <NextLink href={artworkPath} passHref prefetch={false}>
      <Link
        css={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
        onClick={() => handleSegmentEvent('artwork_title')}
      >
        <Heading
          size={{ '@initial': 5, '@bp1': 6, '@bp2': 7 }}
          css={{ wordBreak: 'break-word' }}
        >
          {artwork.name}
        </Heading>
      </Link>
    </NextLink>
  );
}
