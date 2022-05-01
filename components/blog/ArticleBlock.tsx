import NextLink from 'next/link';

import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Image from 'components/base/Image';
import Flex from 'components/base/Flex';

import { urlWithParams } from 'utils/urls';
import { postedOn } from 'utils/dates/dates';
import Mono from 'components/base/Mono';
import Paragraph from 'components/base/Paragraph';

export default function ArticleBlock(props): JSX.Element {
  const { article } = props;

  const imageArgs = {
    q: 90,
    w: 630,
    h: 420,
    fit: 'pad',
  };

  return (
    <NextLink href={`/blog/${article.slug}`} passHref prefetch={false}>
      <Flex
        as="a"
        css={{
          border: '2px solid $black100',
          flexDirection: 'column',
          textDecoration: 'none',
          color: '$black100',
          transition: 'transform $1 $ease',
          willChange: 'transform',
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '$3',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Box css={{ borderBottom: '2px solid $black100' }}>
          <Image
            src={urlWithParams(article?.coverImage, imageArgs)}
            css={{ display: 'block' }}
            loading="lazy"
          />
        </Box>
        <Box css={{ padding: '$7' }}>
          <Heading size={3} css={{ marginBottom: '$3', lineHeight: 1.2 }}>
            {article.title}
          </Heading>
          <Paragraph>{article?.shortDescription}</Paragraph>
        </Box>
        <Box css={{ paddingX: '$7', paddingBottom: '$7', marginTop: 'auto' }}>
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
    </NextLink>
  );
}
