import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPropsResult } from 'next';

import { styled } from 'stitches.config';

import Body from 'components/base/Body';
import Page from 'components/Page';
import Link from 'components/links/Link';
import LoadingPage from 'components/LoadingPage';

import {
  SuggestedTagsCounts,
  SuggestedTagsCountsDocument,
  SuggestedTagsCountsVariables,
} from 'graphql/server/queries/suggested-tags-count.generated';

import { getFirstValue } from 'utils/helpers';

import { fndServerClient } from 'lib/clients/graphql';

const PageBody = styled(Body, {
  '@bp1': {
    paddingTop: '$8',
  },
});

const TagLink = styled('a', {
  display: 'inline-block',
  textDecoration: 'none',
  fontFamily: '$suisse',
  fontWeight: 600,
  color: '$black30',
  lineHeight: 1,
  willChange: 'transform',
  transition: 'color $1 ease-out, transform $1 ease-out',
  letterSpacing: '-0.02em',
  '@media(max-width: 40em)': {
    fontSize: '$3',
    lineHeight: 1.3,
  },

  '@bp0': {
    fontSize: '$7',
  },
  '@bp4': {
    fontSize: '$13',
  },
  '@hover': {
    '&:hover': {
      color: '$black100',
      transform: 'translateX(20px)',
    },
  },
});

const Count = styled('sup', {
  marginLeft: '$2',
  verticalAlign: 'text-top',
  fontSize: '$0',
  position: 'absolute',
  top: 7,
  '@bp1': {
    fontSize: '$3',
  },
  '@bp4': {
    fontSize: '$4',
    top: 15,
  },
});

export default function Tags(props: TagsPageProps): JSX.Element {
  const { tags: cachedTags } = props;

  const router = useRouter();

  const tagRedirect = getFirstValue(router.query.tags);

  const tags = cachedTags?.getCachedSuggestedTagCounts ?? [];

  useEffect(
    () => {
      if (tagRedirect) {
        router.push(`/tags/${tagRedirect}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, tagRedirect]
  );

  return (
    <Page title="Tags">
      <PageBody>
        {router.isReady ? (
          <ul>
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link href={`/tags/${encodeURIComponent(tag)}`}>
                  <TagLink>
                    {tag}
                    <Count>{count}</Count>
                  </TagLink>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <LoadingPage />
        )}
      </PageBody>
    </Page>
  );
}

interface TagsPageProps {
  tags: SuggestedTagsCounts;
}

//
export async function getStaticProps(): Promise<
  GetStaticPropsResult<TagsPageProps>
> {
  const client = fndServerClient();

  const suggestedTags = await client.request<
    SuggestedTagsCounts,
    SuggestedTagsCountsVariables
  >(SuggestedTagsCountsDocument);

  return {
    props: {
      tags: suggestedTags,
    },
    // 5 minutes in seconds
    revalidate: 5 * 60,
  };
}
