import NextLink from 'next/link';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Button from 'components/base/Button';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import Link from 'components/base/Link';

import useTransactionParams from 'hooks/use-transaction-params';

import { isValidTxHash } from 'utils/helpers';
import { buildArtworkPath } from 'utils/artwork/artwork';

import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

interface BidSubmittedActionsProps {
  artwork: ArtworkFragmentExtended;
}

export default function BidSubmittedActions(
  props: BidSubmittedActionsProps
): JSX.Element {
  const { artwork } = props;

  const { txHash } = useTransactionParams();

  const profilePath = buildArtworkPath({ artwork, user: artwork?.creator });

  return (
    <Grid css={{ gap: '$7', width: '100%', '@bp1': { maxWidth: 280 } }}>
      <NextLink href={profilePath} passHref>
        <Link css={{ display: 'block', textDecoration: 'none' }}>
          <Button
            size="large"
            color="black"
            appearance="outline"
            shape="regular"
            css={{ width: '100%', backgroundColor: 'transparent' }}
          >
            View artwork
          </Button>
        </Link>
      </NextLink>

      {isValidTxHash(txHash) && (
        <Flex
          css={{
            justifyContent: 'center',
            '@bp1': {
              justifyContent: 'flex-start',
            },
          }}
        >
          <TransactionHashLink txHash={txHash} />
        </Flex>
      )}
    </Grid>
  );
}
