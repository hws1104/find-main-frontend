import NextLink from 'next/link';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Image from 'components/base/Image';
import Page from 'components/Page';
import Body from 'components/base/Body';
import Link from 'components/base/Link';
import { ArticleGrid } from 'components/Articles';

import { getAllArticles } from 'queries/server/articles';

import { urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';

import { PageType } from 'types/page';
import Mono from 'components/base/Mono';

export default function BlogIndex(props) {
  const { articles } = props;
  const [featuredArticle, ...otherArticles] = articles;
  return (
    <Page title="Blog" type={PageType.maximal}>
      <Body
        css={{
          position: 'relative',
          zIndex: 4,
          paddingY: '$7',
          '@bp0': {
            paddingY: '$8',
          },
          '@bp1': {
            paddingY: '$9',
          },
          '@bp2': {
            paddingY: '$10',
          },
        }}
      >
        <Box
          css={{
            marginBottom: '$7',
            '@bp1': {
              marginBottom: '$8',
            },
          }}
        >
          <FeaturedArticle article={featuredArticle} />
        </Box>
        <ArticleGrid articles={otherArticles} />
      </Body>
    </Page>
  );
}

function FeaturedArticle(props) {
  const { article } = props;

  const imageArgs = {
    q: 90,
    w: 630,
    h: 420,
    fit: 'pad',
  };

  return (
    <NextLink href={`/blog/${article.slug}`} passHref>
      <Link
        as="a"
        css={{
          display: 'grid',
          gap: 3,
          border: '2px solid $black100',
          textDecoration: 'none',
          color: '$black100',
          transition: 'transform $1 $ease',
          willChange: 'transform',
          gridTemplateColumns: 'repeat(1, 1fr)',
          '@hover': {
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '$2',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          '@bp2': { gridTemplateColumns: '450px auto' },
          '@bp3': { gridTemplateColumns: '600px auto' },
        }}
      >
        <Box
          css={{
            borderBottom: '2px solid $black100',
            '@bp2': {
              borderBottom: 'none',
              borderRight: '2px solid $black100',
              display: 'flex',
            },
          }}
        >
          <Image
            src={urlWithParams(article?.coverImage, imageArgs)}
            css={{
              display: 'block',
              width: '100%',
              '@bp2': {
                objectFit: 'cover',
              },
            }}
          />
        </Box>
        <Flex
          css={{
            padding: '$7',
            flexDirection: 'column',
            '@bp3': { padding: '$8' },
          }}
        >
          <Heading
            size={5}
            css={{
              maxWidth: 560,
              marginBottom: '$7',
            }}
          >
            {article.title}
          </Heading>
          <Text size={2} css={{ maxWidth: 420, lineHeight: '$body' }}>
            {article?.shortDescription}
          </Text>
          <Box css={{ paddingTop: '$8', marginTop: 'auto' }}>
            <Mono
              size={0}
              css={{
                marginTop: 'auto',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Published {postedOn(article?.datePosted)}
            </Mono>
          </Box>
        </Flex>
      </Link>
    </NextLink>
  );
}

export async function getStaticProps() {
  const articles = await getAllArticles();

  return {
    props: {
      articles,
    },
    revalidate: 60,
  };
}
