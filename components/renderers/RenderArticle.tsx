import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Link from 'components/base/Link';
import Paragraph from 'components/base/Paragraph';

import { ArticleImage } from 'components/ArticleImage';

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <Heading
        as="h1"
        size={{ '@initial': 5, '@bp1': 6 }}
        css={{
          maxWidth: 720,
          marginX: 'auto',
          marginBottom: '$6',
          '@bp1': {
            marginBottom: '$7',
          },
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Heading
        size={{ '@initial': 4, '@bp1': 5 }}
        css={{
          maxWidth: 720,
          marginX: 'auto',
          marginBottom: '$4',
          marginTop: '$7',
          '@bp0': {
            marginBottom: '$6',
          },
          '@bp1': {
            marginBottom: '$7',
            marginTop: '$8',
          },
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Heading
        as="h3"
        size={{ '@initial': 3, '@bp1': 4 }}
        css={{
          maxWidth: 720,
          marginX: 'auto',
          marginBottom: '$4',
          marginTop: '$7',
          '@bp0': {
            marginBottom: '$6',
          },
          '@bp1': {
            marginBottom: '$7',
            marginTop: '$8',
          },
        }}
      >
        {children}
      </Heading>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Paragraph
        css={{
          maxWidth: 720,
          marginX: 'auto',
          marginY: '$6',
          '@bp0': { fontSize: '$2' },
          '@bp1': {
            marginY: '$7',
          },
        }}
        className="paragraph"
      >
        {children}
      </Paragraph>
    ),
    [INLINES.HYPERLINK]: (node) => {
      const { uri } = node.data;
      const [content] = node.content;

      return (
        <Link
          href={uri}
          target="_blank"
          css={{
            color: 'currentColor',
            textDecoration: 'none',
            transition: 'color $1 $ease',
            borderBottom: 'solid 1px $black10',
            '@hover': {
              '&:hover': {
                borderColor: '$black100',
              },
            },
          }}
        >
          {content.value}
        </Link>
      );
    },
    [BLOCKS.QUOTE]: (node, children) => (
      <Text
        as="blockquote"
        size={{ '@initial': 3, '@bp1': 4 }}
        css={{
          fontWeight: 600,
          maxWidth: 540,
          marginX: 'auto',
          textAlign: 'center',
          marginY: '$7',
          '@bp0': {
            marginY: '$8',
          },
          '@bp1': {
            marginY: '$9',
          },
          '@bp2': {
            marginY: '$10',
          },
          '& > p': {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 400,
            lineHeight: 1.4,
          },
          '& > p:last-child:not(:first-of-type)': {
            fontSize: '$0',
            fontFamily: '$mono',
            fontWeight: 400,
            lineHeight: 1.7,
            letterSpacing: 0,
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <Text
        as="ol"
        css={{
          maxWidth: 720,
          marginX: 'auto',
          listStyle: 'decimal',
          marginTop: '$6',
          marginBottom: '$6',
          paddingLeft: '$6',
          '@bp0': {
            paddingLeft: '$7',
            fontSize: '$2',
          },
          '@bp1': {
            marginTop: '$7',
            marginBottom: '$8',
          },
          '@bp2': {
            marginBottom: '$9',
          },
          '& .paragraph': {
            marginY: '$4',
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <Text
        as="ul"
        css={{
          maxWidth: 720,
          marginX: 'auto',
          listStyle: 'initial',
          marginTop: '$6',
          marginBottom: '$6',
          paddingLeft: '$6',
          '@bp0': {
            paddingLeft: '$7',
            fontSize: '$2',
          },
          '@bp1': {
            marginTop: '$7',
            marginBottom: '$8',
          },
          '@bp2': {
            marginBottom: '$9',
          },
          '& .paragraph': {
            marginY: '$4',
          },
        }}
      >
        {children}
      </Text>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const file = node?.data?.target?.fields?.file;

      if (!file) {
        return null;
      }

      const mimeType = file?.contentType;
      const [mimeGroup] = mimeType.split('/');

      if (mimeGroup === 'image') {
        return <ArticleImage src={file.url} />;
      }
    },
  },
};

export default function RenderArticle(doc) {
  return documentToReactComponents(doc, options);
}
