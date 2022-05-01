/* eslint-disable react/jsx-max-depth */
import ArtworkPageMeta from './page/ArtworkPageMeta';

import Box from 'components/base/Box';
import GraySquare from 'components/base/GraySquare';
import Heading from 'components/base/Heading';
import Grid from 'components/base/Grid';
import ArtworkInfo from './ArtworkInfo';
import MintEvent from './MintEvent';
import ArtworkAuctionState from './auction/ArtworkAuctionState';

import { ArtworkActivitySelected } from 'hooks/queries/hasura/use-artwork-activity';

import { CollectionFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { ComputedArtworkStatus } from 'types/artwork/artwork';
import { ArtworkEvent } from 'types/Event';
import { ArtworkV2 } from 'types/Artwork';
import Account from 'types/Account';
import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';

interface ArtworkHeaderProps {
  artwork: ArtworkV2;
  artworkActivityData: ArtworkActivitySelected;
  collection: CollectionFragmentExtended;
  creator: Account;
  history: ArtworkEvent[];
  isOwner?: boolean;
  isOwnerOnProfile?: boolean;
  mintEvent?: ArtworkEvent;
  publicAddress: string;
  percentSplits: ArtworkPageSplitRecipient[];
  status: ComputedArtworkStatus;
}

export default function ArtworkHeader(props: ArtworkHeaderProps): JSX.Element {
  const {
    artwork,
    artworkActivityData,
    collection,
    creator,
    history,
    isOwner = false,
    isOwnerOnProfile = false,
    mintEvent,
    publicAddress,
    status,
    percentSplits,
  } = props;

  return (
    <Grid
      css={{
        backgroundColor: '$white100',
        paddingTop: '$7',
        '@bp2': {
          gridTemplateColumns: '1fr 1fr',
          gridGap: '$9',
          alignItems: 'flex-end',
          paddingTop: '$8',
        },
      }}
    >
      <Box>
        <Box>
          {artwork?.name ? (
            <Heading as="h1" size={{ '@initial': 4, '@bp0': 6 }}>
              {artwork.name}
            </Heading>
          ) : (
            <GraySquare
              css={{ height: 46, width: 250, '@bp0': { height: 72 } }}
            />
          )}
          {mintEvent && <MintEvent mintEvent={mintEvent} />}
          <Box
            css={{
              paddingY: '$6',
              '@bp2': {
                paddingTop: '$8',
                paddingBottom: 0,
              },
            }}
          >
            {collection !== null && (
              <ArtworkInfo
                user={artwork.creator}
                collection={collection}
                creatorPublicKey={creator?.publicKey}
                percentSplits={percentSplits}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box
        css={{ '@bp2': { borderLeft: '1px solid $black10', paddingX: '$9' } }}
      >
        <ArtworkAuctionState
          auction={artworkActivityData?.activeAuction}
          currentUserBid={artworkActivityData?.currentUserBid}
          artworkHistory={history}
          creator={creator}
          artwork={artwork}
          publicAddress={publicAddress}
        />
        <ArtworkPageMeta
          artwork={artwork}
          isOwnerOnProfile={isOwnerOnProfile}
          status={status}
          isOwner={isOwner}
          auction={artworkActivityData?.activeAuction}
          publicAddress={publicAddress}
        />
      </Box>
    </Grid>
  );
}
