import { useRouter } from 'next/router';

import { getAllArticles, getArticleBySlug } from 'queries/server/articles';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Heading from 'components/base/Heading';
import Image from 'components/base/Image';
import Body from 'components/base/Body';
import Page from 'components/Page';

import { buildAvatarUrl, urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';
import RenderArticle from 'components/renderers/RenderArticle';
import LoadingPage from 'components/LoadingPage';
import Mono from 'components/base/Mono';

export default function BlogArticle(props) {
  const { article } = props;

  const router = useRouter();

  const coverImageUrl = urlWithParams(article?.coverImage, {
    q: 90,
    w: 1920,
    fit: 'fill',
  });

  const avatarUrl = buildAvatarUrl(article?.author?.avatar);

  if (router.isFallback) {
    return <LoadingPage />;
  }

  return (
    <Page
      title={article?.title}
      description={article?.shortDescription}
      image={coverImageUrl}
    >
      <Box
        css={{ '@bp1': { paddingTop: '$9' }, '@bp2': { paddingTop: '$10' } }}
      >
        {article?.coverImage && (
          <Box
            css={{
              maxWidth: 1080,
              marginX: 'auto',
              '@bp2': {
                borderColor: '$black100',
                borderWidth: 3,
                borderStyle: 'solid',
                borderLeft: 'solid',
                borderRight: 'solid',
              },
            }}
          >
            <Image
              alt={article?.title}
              src={coverImageUrl}
              css={{ width: '100%', display: 'block' }}
            />
          </Box>
        )}

        <Box css={{ marginX: '$6', marginTop: -30 }}>
          <Box
            css={{
              background: '$white100',
              position: 'relative',
              zIndex: 1,
              maxWidth: 910,
              marginX: 'auto',
              marginBottom: '$7',
              paddingX: '$6',
              paddingY: '$6',
              border: '3px solid $black100',
              '@bp0': {
                marginBottom: '$8',
              },
              '@bp1': {
                marginBottom: '$10',
                paddingX: '$9',
                paddingY: '$8',
              },
            }}
          >
            <Heading
              as="h1"
              size={{ '@initial': 3, '@bp0': 5, '@bp1': 7 }}
              css={{
                marginBottom: '$6',
                '@bp0': { marginBottom: '$7' },
                '@bp1': { marginBottom: '$6' },
              }}
            >
              {article?.title}
            </Heading>

            <Text
              as="p"
              size={{ '@bp0': 2 }}
              css={{
                maxWidth: 420,
                lineHeight: '$body',
                marginBottom: '$6',
                '@bp1': { marginBottom: '$7' },
              }}
            >
              {article?.shortDescription}
            </Text>

            {article?.datePosted && (
              <Mono
                css={{
                  fontSize: '$0',
                  marginTop: 'auto',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Published {postedOn(article?.datePosted)}
              </Mono>
            )}
          </Box>
        </Box>
      </Box>

      <Body>
        <Box>{RenderArticle(article?.content)}</Box>

        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            maxWidth: 500,
            border: '3px solid $black100',
            padding: '$7',
            marginX: 'auto',
            marginTop: '$8',
            '@bp1': {
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '$10',
            },
          }}
        >
          <Box
            css={{
              width: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '$6',
              '@bp0': {
                marginBottom: 0,
              },
              '@bp1': { marginRight: '$6' },
            }}
          >
            {article?.author?.avatar && (
              <Image
                alt={article?.author?.name}
                src={avatarUrl}
                css={{ width: '100%', display: 'block' }}
              />
            )}
          </Box>
          <Box>
            <Mono
              size={0}
              css={{
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Written by
            </Mono>
            <Heading
              as="h3"
              size={4}
              css={{
                marginTop: '$2',
              }}
            >
              {article?.author?.name}
            </Heading>
            <Text
              css={{
                fontSize: '$2',
                marginTop: '$2',
              }}
            >
              {article?.author?.role}
            </Text>
          </Box>
        </Box>
      </Body>
    </Page>
  );
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const paths = articles.map((article) => ({
    params: {
      slug: article.slug,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);

  return {
    props: {
      article,
    },
    revalidate: 60,
  };
}
