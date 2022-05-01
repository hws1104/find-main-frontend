import { absoluteUrl } from './urls';

interface OgTagsArgs {
  pageTitle: string;
  ogImage: string;
  pageDescription?: string;
  asPath?: string;
}

export function buildOgTags({
  ogImage,
  pageDescription,
  pageTitle,
  asPath,
}: OgTagsArgs) {
  const ogTags = [
    {
      name: 'title',
      content: pageTitle,
    },
    {
      name: 'description',
      content: pageDescription,
    },
    {
      property: 'og:title',
      content: pageTitle,
    },
    {
      property: 'og:url',
      content: asPath && absoluteUrl(asPath),
    },
    {
      property: 'og:description',
      content: pageDescription,
    },
    {
      property: 'og:image',
      content: ogImage,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: pageTitle,
    },
    {
      name: 'twitter:site',
      content: '@withfnd',
    },
    {
      name: 'twitter:url',
      content: asPath && absoluteUrl(asPath),
    },
    {
      name: 'twitter:image',
      content: ogImage,
    },
  ];

  return ogTags.filter((tag) => Boolean(tag.content));
}
