/* eslint-disable react/jsx-max-depth */
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import Body from 'components/base/Body';
import Page from 'components/Page';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Layout, { BackgroundColor } from 'components/layouts/Layout';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';

import { PageType } from 'types/page';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import { useArtworkByUuid } from 'graphql/hasura/queries/artwork-by-uuid.generated';

import { getFirstValue } from 'utils/helpers';

interface TransactionLayoutWithCardV2Props {
  title: string;
  backgroundColor: BackgroundColor;
  pageType: PageType;
  artworkQueryType: 'uuid' | 'tokenId';
}

export type CurriedLayout = (
  arg0: JSX.Element,
  arg1: TransactionLayoutWithCardV2Props
) => JSX.Element;

export default function TransactionLayoutWithCardV2(
  props: TransactionLayoutWithCardV2Props
): CurriedLayout {
  const { artworkQueryType } = props;

  return function TransactionLayoutContainer(page: JSX.Element) {
    if (artworkQueryType === 'uuid') {
      return <TransactionLayoutUuid {...props}>{page}</TransactionLayoutUuid>;
    }
    return (
      <TransactionLayoutTokenId {...props}>{page}</TransactionLayoutTokenId>
    );
  };
}

interface TransactionLayoutRenderProps
  extends TransactionLayoutWithCardV2Props {
  children: ReactNode;
}

function TransactionLayoutUuid(props: TransactionLayoutRenderProps) {
  const { children, ...rest } = props;

  const router = useRouter();

  const artworkId = getFirstValue(router.query.id);

  const { data: artworkData } = useArtworkByUuid(
    { id: artworkId },
    {
      enabled: Boolean(artworkId),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const artwork = artworkData?.artwork;

  return (
    <TransactionLayout {...rest} artwork={artwork}>
      {children}
    </TransactionLayout>
  );
}

function TransactionLayoutTokenId(props: TransactionLayoutRenderProps) {
  const { children, ...rest } = props;

  const { data: artwork } = useArtworkByContractTokenIdFromRouter();

  return (
    <TransactionLayout {...rest} artwork={artwork}>
      {children}
    </TransactionLayout>
  );
}

interface TransactionLayoutProps extends TransactionLayoutRenderProps {
  artwork: ArtworkFragmentExtended;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function TransactionLayout(props: TransactionLayoutProps) {
  const { title, backgroundColor, pageType, children, artwork } = props;
  return (
    <Layout backgroundColor={backgroundColor}>
      <Page title={title} type={pageType}>
        <Body
          css={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Flex
            css={{
              position: 'relative',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Grid
              css={{
                gridTemplateColumns: '560px 340px',
                gap: 60,
              }}
            >
              {children}
              <Box>
                <ArtworkCard
                  artwork={artwork}
                  creator={artwork?.creator}
                  currentUser={null}
                  cardType="regular"
                />
              </Box>
            </Grid>
          </Flex>
        </Body>
      </Page>
    </Layout>
  );
}
