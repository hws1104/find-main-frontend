import Head from 'next/head';
import { useRouter } from 'next/router';

import { BasicArtwork } from 'types/Artwork';

import { buildPageShareUrl, buildPosterUrl } from 'utils/assets';
import { truncateMetaDescription } from 'utils/helpers';
import { buildOgTags } from 'utils/og-tags';

interface PrivateSalePageMetaProps {
  artwork: BasicArtwork;
}

export default function PrivateSalePageMeta(props: PrivateSalePageMetaProps) {
  const { asPath } = useRouter();

  const { artwork } = props;

  const artworkCreator = artwork?.creator;
  const artworkCreatorName = artworkCreator?.name ?? artworkCreator?.username;

  const pageTitle = `Complete the private sale for “${artwork?.name}” by ${artworkCreatorName} | Foundation`;

  const openGraphAsset: string = buildPageShareUrl(artwork);
  const posterUrl: string = buildPosterUrl(artwork, { bg: 'F2F2F2' });
  const truncatedDescription = truncateMetaDescription(artwork?.description);

  const metaTags = buildOgTags({
    pageTitle,
    ogImage: posterUrl ?? openGraphAsset,
    pageDescription: truncatedDescription,
    asPath,
  });

  return (
    <Head>
      <title>{pageTitle}</title>

      {metaTags.map((tag) => (
        <meta {...tag} key={tag.name || tag.property} />
      ))}
    </Head>
  );
}
