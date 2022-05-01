import { styled } from 'stitches.config';
import NextLink from 'next/link';

import Tag from 'components/transactions/tags/Tag';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Link from 'components/base/Link';
import Grid from 'components/base/Grid';
import InternalLink from 'components/links/InternalLink';

import { BasicArtwork } from 'types/Artwork';
import { buildArtworkTagsPath } from 'utils/artwork/artwork';

export const LinkedTag = styled(Tag, {
  cursor: 'pointer',
  transition: 'transform $1 $ease',
  willChange: 'transform',
  '@hover': {
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
});

interface ArtworkTagProps {
  tags: string[];
  isCurrentUserProfile: boolean;
  artwork: BasicArtwork;
}

export default function ArtworkTags(props: ArtworkTagProps): JSX.Element {
  const { tags, isCurrentUserProfile, artwork } = props;

  return (
    <Grid css={{ gap: '$5' }}>
      <Text size={1} weight={600}>
        Tags
      </Text>
      <Flex css={{ flexWrap: 'wrap', maxWidth: 350 }}>
        {tags.map((tag: string) => (
          <NextLink
            key={tag}
            prefetch={false}
            passHref
            href={`/tags/${encodeURIComponent(tag)}`}
          >
            <Link style={{ textDecoration: 'none', color: 'inherit' }}>
              <LinkedTag key={tag}>{tag}</LinkedTag>
            </Link>
          </NextLink>
        ))}
      </Flex>
      {isCurrentUserProfile && (
        <Flex>
          <InternalLink
            href={`${buildArtworkTagsPath(artwork)}?redirect=profile`}
          >
            Edit tags
          </InternalLink>
        </Flex>
      )}
    </Grid>
  );
}
