/* eslint-disable react/jsx-max-depth */

import { styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Box from 'components/base/Box';
import Paragraph from 'components/base/Paragraph';
import SplitsUserSearch from 'components/forms/fields/SplitsUserSearch';
import SplitsSection from 'components/transactions/split/SplitsSection';
import TransitionPane from 'components/animation/TransitionPane';
import TransactionSubmitButton from '../generic/TransactionSubmitButton';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';

const FormSection = styled(Box, {
  paddingX: 72,
});

interface MintFieldsSplitsProps {
  publicAddress: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function MintFieldsSplits(props: MintFieldsSplitsProps) {
  const { publicAddress } = props;

  return (
    <TransitionPane>
      <TransactionCard css={{ paddingY: 72 }}>
        <FormSection>
          <Heading size={4} css={{ marginBottom: '$7', maxWidth: 280 }}>
            Choose how your earnings are split
          </Heading>

          <Paragraph css={{ marginBottom: '$8' }}>
            Primary sale earnings and royalty payments from secondary sales will
            be automatically deposited into each recipient’s wallet. Once your
            split contract is minted on the Ethereum blockchain, it cannot be
            updated or changed.
          </Paragraph>

          <Grid css={{ gap: '$9' }}>
            <Grid css={{ gap: '$8' }}>
              <SplitsUserSearch publicAddress={publicAddress} name="splits" />
              <SplitsSection
                currentUserPublicAddress={publicAddress}
                name="splits"
              />
            </Grid>

            <TransactionSubmitButton
              label="Mint NFT"
              submittingLabel="Minting NFT…"
              submittedLabel="NFT Minted"
            />
          </Grid>
        </FormSection>
      </TransactionCard>
    </TransitionPane>
  );
}
