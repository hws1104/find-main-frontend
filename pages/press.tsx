/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { GetStaticPropsResult } from 'next';
import { useEffect } from 'react';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import {
  MarqueeContainer,
  MarqueeWrapper,
} from 'components/brand/ShapesAndMarquee';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Link from 'components/base/Link';
import Grid from 'components/base/Grid';
import Image from 'components/base/Image';
import Picture from 'components/base/Picture';
import BackgroundGradient from 'components/brand/BackgroundGradient';
import PressCard from 'components/brand/cards/PressCard';
import Stat from 'components/brand/Stat';
import FooterMarquee from 'components/brand/FooterMarquee';
import { ArtworkCard } from 'components/cards/artwork/ArtworkCard';

import { PageColorMode, PageType } from 'types/page';

import {
  formatETHWithSuffix,
  formatInteger,
  withCeilToTwoDecimals,
} from 'utils/formatters';
import { pressText } from 'utils/data/press-text';

import { getSalesStats } from 'queries/hasura/sales';
import { getArtworksByTokenIds } from 'queries/hasura/artworks-v2';
import {
  getArtworkContractAddress,
  getSortedArtworks,
} from 'utils/artwork/artwork';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import { SalesStats } from 'graphql/hasura/queries/sales-stats.generated';

interface PressPageProps {
  stats: SalesStats;
  featuredArtworks: ArtworkFragmentExtended[];
  highlightedArtworks: ArtworkFragmentExtended[];
}

const mergeArrayObjectByTokenId = (array1, array2) => {
  return array1.map((item, i) => {
    if (item.tokenId === array2[i].tokenId) {
      return Object.assign({}, item, array2[i]);
    }
  });
};

export default function Press(props: PressPageProps): JSX.Element {
  const { stats, featuredArtworks, highlightedArtworks } = props;

  const artworks = mergeArrayObjectByTokenId(
    featuredArtworks,
    pressText.highlightedCardsInfo
  );

  const numOfSales =
    stats?.privateSalesTotalAmount?.aggregate?.sum?.saleAmountInETH +
    stats?.auctionSalesTotalAmount?.aggregate?.sum?.highestBidAmount;
  const numOfBidsPlaced = stats?.bidsTotalAmount?.aggregate?.count;
  const valOfBidsOverall = stats?.bidsTotalAmount?.aggregate?.sum?.bidAmount;
  const numOfNfts = stats?.artworkTotal?.aggregate?.count;

  const statsArray = [
    {
      description: 'NFT Sales',
      stat: formatETHWithSuffix(withCeilToTwoDecimals(numOfSales)),
      forUSD: numOfSales,
    },
    {
      description: 'Number of bids placed',
      stat: formatInteger(numOfBidsPlaced),
    },
    {
      description: 'Bid overall',
      stat: formatETHWithSuffix(withCeilToTwoDecimals(valOfBidsOverall)),
      forUSD: valOfBidsOverall,
    },
    {
      description: 'Number of NFTs successfully collected',
      stat: formatInteger(numOfNfts),
    },
  ];

  useEffect(() => {
    document.body.classList.add('webkit-fit-content');
    return () => {
      document.body.classList.remove('webkit-fit-content');
    };
  }, []);

  return (
    <Page
      title="Press"
      headerMode={PageColorMode.dark}
      type={PageType.maximal}
      image="https://foundation.app/press-opengraph.jpg"
    >
      <Box css={{ overflowX: 'hidden', overflow: 'clip' }}>
        <Box
          css={{
            backgroundImage: 'url(/images/press-gradient.png)',
            zIndex: -1,
            backgroundPosition: '10%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Flex
            css={{
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Picture css={{ textAlign: 'center' }}>
              <source
                srcSet="/images/press/tell-stories-with-us.png"
                media="(min-width: 500px)"
              />
              <Image
                css={{
                  margin: 'auto',
                  width: '100%',
                  maxWidth: 1300,
                  marginTop: '$9',
                }}
                src="/images/press/tell-stories-with-us-mobile.png"
                alt="Tell stories with us."
              />
            </Picture>
          </Flex>

          <MarqueeContainer
            css={{
              marginTop: -11,
              background: 'linear-gradient(180deg, #00FF75 0%, #EBFF00 100%);',
              boxShadow: '$1',
              height: 40,
              '@bp1': {
                height: 50,
              },
            }}
          >
            <MarqueeWrapper css={{ animationDuration: '10s' }}>
              {[...Array(20)].map((_, i) => (
                <Box
                  css={{
                    whiteSpace: 'nowrap',
                    marginLeft: '$2',
                  }}
                  key={i}
                >
                  <Flex
                    css={{
                      alignItems: 'center',
                      fontSize: '$4',
                      lineHeight: 1,
                      '@bp1': { fontSize: '$5' },
                    }}
                  >
                    Press{' '}
                    <Box
                      as="span"
                      css={{
                        fontSize: '$3',
                        marginLeft: '$2',
                        '@bp1': { fontSize: '$4' },
                      }}
                    >
                      ⬤
                    </Box>
                  </Flex>
                </Box>
              ))}
            </MarqueeWrapper>
          </MarqueeContainer>
        </Box>

        <Body
          css={{
            marginBottom: '$11',
            paddingTop: 'clamp(400px, 41% + 134px, 780px)',
            '@bp3': {
              paddingTop: 'clamp(670px, 41% + 134px, 780px)',
            },
            '@media(max-width: 500px)': {
              paddingTop: 'calc(165% + 102px)',
            },
          }}
        >
          <Grid
            css={{
              gridRowGap: '$8',
              maxWidth: 960,
              marginX: 'auto',
            }}
          >
            <Text weight={400} size={{ '@initial': 3, '@bp1': 4 }}>
              Foundation is a platform that aims to build a new creative
              economy—a world where creators can use the Ethereum blockchain to
              value their work in entirely new ways, and build stronger
              connections with their supporters.
            </Text>
            <Text weight={400} size={{ '@initial': 3, '@bp1': 4 }}>
              We’re just getting started, and we’re excited to share our story
              with writers who are curious about this expansive new world.
            </Text>
            <Text weight={400} size={{ '@initial': 3, '@bp1': 4 }}>
              Working on an article about Foundation?{' '}
              <Link
                href="mailto:press@foundation.app"
                css={{
                  color: 'inherit',
                  transition: 'color $1 $ease',
                  '@hover': {
                    '&:hover': {
                      color: '$blue100',
                    },
                  },
                }}
              >
                Get in touch
              </Link>
              .
            </Text>
          </Grid>
        </Body>
        <BackgroundGradient
          color="yellow"
          css={{
            paddingX: '$6',
            '&:after': {
              height: 200,
            },
            '@bp1': {
              '&:after': {
                height: 800,
              },
            },
          }}
        >
          <Box css={{ maxWidth: 960, marginX: 'auto' }}>
            <Text
              weight={400}
              size={{ '@initial': 2, '@bp1': 3 }}
              css={{
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                paddingTop: '$7',
                paddingBottom: '$6',
                '@bp1': {
                  paddingTop: '$11',
                  paddingBottom: '$10',
                },
              }}
            >
              What they're saying
            </Text>
          </Box>
          <Grid
            css={{
              maxWidth: 960,
              marginX: 'auto',
              gridColumnGap: '$6',
              gridRowGap: '$8',
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              '@bp1': {
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              },
              '@bp3': {
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {pressText.press.map((press) => (
              <PressCard
                title={press.title}
                key={press.href}
                href={press.href}
                imageSrc={press.imageSrc}
                alt={press.alt}
              />
            ))}
          </Grid>
        </BackgroundGradient>
        <Box
          css={{
            maxWidth: 960,
            marginX: 'auto',
            paddingX: '$6',
            paddingTop: '$10',
            '@bp1': {
              paddingTop: '$11',
            },
          }}
        >
          <Text weight={600} size={{ '@initial': 4, '@bp1': 5 }}>
            Highlights
          </Text>
          <Text
            css={{
              marginTop: '$6',
              marginBottom: '$7',
              '@bp1': {
                marginBottom: '$8',
              },
            }}
            weight={400}
            size={{ '@initial': 3, '@bp1': 4 }}
          >
            Since we launched in February 2021:
          </Text>
          <Box
            css={{
              paddingY: '$7',
            }}
          >
            {statsArray.map((stat) => (
              <Stat
                key={stat.description}
                description={stat.description}
                stat={stat.stat}
                forUSD={stat.forUSD}
              />
            ))}
          </Box>
        </Box>
        <Grid
          css={{
            paddingX: '$6',
            maxWidth: 960,
            marginX: 'auto',
            gridRowGap: '$8',
            marginY: '$9',
            '@bp1': {
              marginY: '$11',
            },
          }}
        >
          {artworks.map((artwork) => (
            <Grid
              key={artwork.id}
              css={{
                gridGap: '$9',
                '@bp1': {
                  gridTemplateColumns: '2fr 3fr',
                },
              }}
            >
              <ArtworkCard
                artwork={artwork}
                creator={artwork.creator}
                currentUser={null}
              />
              <Text size={{ '@initial': 3, '@bp1': 4 }}>
                {artwork.highlightedText}
              </Text>
            </Grid>
          ))}
        </Grid>
        <BackgroundGradient
          color="gray"
          css={{
            paddingX: '$6',
            '&:after': {
              height: 200,
            },
          }}
        >
          <Box css={{ maxWidth: 960, marginX: 'auto' }}>
            <Text
              weight={400}
              size={{ '@initial': 2, '@bp1': 3 }}
              css={{
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                paddingTop: '$7',
                paddingBottom: '$6',
                '@bp1': {
                  paddingTop: '$11',
                  paddingBottom: '$10',
                },
              }}
            >
              More highlights
            </Text>
          </Box>
          <Grid
            css={{
              maxWidth: 1600,
              marginX: 'auto',
              marginBottom: '$11',
              gridGap: '$6',
              '@bp1': {
                gridTemplateColumns: '1fr 1fr',
              },
              '@bp2': {
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
              },
            }}
          >
            {highlightedArtworks.map((artwork, index) => (
              <ArtworkCard
                key={index}
                artwork={artwork}
                creator={artwork.creator}
                currentUser={null}
              />
            ))}
          </Grid>
        </BackgroundGradient>
        <FooterMarquee backgroundColor="#8000FF" />
      </Box>
    </Page>
  );
}

type PageStaticProps = GetStaticPropsResult<PressPageProps>;

export async function getStaticProps(): Promise<PageStaticProps> {
  const stats = await getSalesStats();
  const tokenIds = [219, 24437, 35855, 13129];

  const featuredArtworks = await getArtworksByTokenIds({
    tokenIds: tokenIds,
    contractAddress: getArtworkContractAddress(null),
  });

  const sortedFeaturedArtworks = getSortedArtworks(tokenIds)(featuredArtworks);

  const highlightedTokenIds = [
    34009, 13201, 40471, 6544, 17865, 6824, 9245, 7180,
  ];
  const highlightedArtworks = await getArtworksByTokenIds({
    tokenIds: highlightedTokenIds,
    contractAddress: getArtworkContractAddress(null),
  });

  const sortedHighlightedArtworks =
    getSortedArtworks(highlightedTokenIds)(highlightedArtworks);

  return {
    props: {
      stats: stats ?? null,
      featuredArtworks: sortedFeaturedArtworks,
      highlightedArtworks: sortedHighlightedArtworks,
    },
    revalidate: 21600,
  };
}
