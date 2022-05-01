import Box from 'components/base/Box';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';

import { TransactionActionButton } from '../generic/TransactionActionButtons';

import { BasicArtwork } from 'types/Artwork';
import { buildArtworkPath } from 'utils/artwork/artwork';

interface ListTransactionAlreadyListedProps {
  artwork: BasicArtwork;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListTransactionAlreadyListed(
  props: ListTransactionAlreadyListedProps
) {
  const { artwork } = props;
  return (
    <TransactionProgressPane
      title="This NFT has already been listed"
      description={
        <Box css={{ maxWidth: 350 }}>
          This NFT has already been listed on our marketplace.
        </Box>
      }
      status="warning"
      meta={
        <Box css={{ width: '100%' }}>
          <TransactionActionButton
            href={buildArtworkPath({ artwork, user: artwork?.creator })}
            label="View NFT"
          />
        </Box>
      }
    />
  );
}
