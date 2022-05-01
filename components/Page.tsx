import Head from 'next/head';
import { useRouter } from 'next/router';
import { always, ifElse } from 'ramda';

import { DESCRIPTION, TITLE, OG_IMAGE } from 'utils/constants/meta';
import { getOgImage } from 'utils/urls';
import { isEmptyOrNil } from 'utils/helpers';
import {
  modelAssetsHost,
  videoAssetsHost,
  appAssetsHost,
  imageAssetsHost,
  modelImageAssetsHost,
} from 'lib/assets';

import Header from 'components/headers/Header';
import Footer from 'components/footers/Footer';

import { PageColorMode, PageType } from 'types/page';
import { buildOgTags } from 'utils/og-tags';
import { CSS } from 'stitches.config';

export interface PageProps {
  children?: JSX.Element | JSX.Element[];
  mode?: PageColorMode;
  headerMode?: PageColorMode;
  footerStyle?: CSS;
  url?: string;
  description?: string;
  title?: boolean | string;
  absolute?: boolean;
  isLight?: boolean;
  image?: string;
  type?: PageType;
}

export default function Page(props: PageProps): JSX.Element {
  const {
    mode = PageColorMode.light,
    headerMode = PageColorMode.light,
    children,
    absolute,
    footerStyle,
    description = DESCRIPTION,
    title = TITLE,
    image = OG_IMAGE,
    type,
  } = props;

  const pageDescription = ifElse(
    isEmptyOrNil,
    always(DESCRIPTION),
    always(description)
  )(description);

  const ogImage = getOgImage(image);

  const { asPath } = useRouter();

  const pageTitle = title ? `${title} | Foundation` : 'Foundation';

  const metaTags = buildOgTags({ pageTitle, pageDescription, asPath, ogImage });

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {metaTags.map((tag) =>
          tag.content ? (
            <meta {...tag} key={tag?.name ?? tag?.property} />
          ) : null
        )}

        <meta property="og:type" content="website" />

        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* 128px shortcut icon for metamask */}
        <link rel="shortcut icon" type="image/png" href="/icon-metamask.png" />

        <link rel="preconnect" href={videoAssetsHost} />
        <link rel="preconnect" href={modelAssetsHost} />
        <link rel="preconnect" href={modelImageAssetsHost} />
        <link rel="preconnect" href={imageAssetsHost} />
        <link rel="preconnect" href={appAssetsHost} />
      </Head>
      <Header
        mode={mode}
        headerMode={headerMode}
        absolute={absolute}
        type={type}
      />
      {children}
      <Footer footerStyle={footerStyle} type={type} />
    </>
  );
}
