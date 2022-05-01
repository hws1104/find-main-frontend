/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { styled } from 'stitches.config';

import { ListFormValues } from './types';

import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';
import TransactionSubmitButton from '../generic/TransactionSubmitButton';
import ETHField from 'components/forms/fields/ETHField';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import TransitionPane from 'components/animation/TransitionPane';
import ListInfo, { ListHelpArticleLink } from './ListInfo';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';

const FormSection = styled(Box, {
  paddingX: 72,
});

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListFieldsSecondary() {
  return (
    <TransitionPane>
      <TransactionCard css={{ paddingY: 72 }}>
        <FormSection css={{ paddingBottom: '$8' }}>
          <Heading size={4} css={{ marginBottom: '$7' }}>
            List your NFT
          </Heading>
          <Paragraph css={{ marginBottom: '$8' }}>
            List an NFT you’ve collected on Foundation for sale in our secondary
            market.
          </Paragraph>

          <Heading size={3} css={{ marginBottom: '$7' }}>
            Set a reserve price
          </Heading>

          <Box>
            <Grid css={{ gap: '$6', maxWidth: 410, marginBottom: '$6' }}>
              <ETHField placeholder="1" name="price" />
              <Text size={2} weight={600} css={{ color: '$black60' }}>
                <ETHinUSDField name="price" />
              </Text>
            </Grid>

            <Flex
              css={{
                marginBottom: '$5',
                '@bp1': {
                  marginBottom: '$7',
                },
              }}
            >
              <ListHelpArticleLink />
            </Flex>
          </Box>
          <ListInfo
            infoSections={[
              'A 10% creator royalty will be charged based on the final sale price of the artwork, and sent to the original  creator.',
              'A 5% service fee will be charged based on the final sale price of the artwork.',
            ]}
          />
        </FormSection>

        <FormSection>
          <TransactionSubmitButton<ListFormValues>
            label="List your NFT"
            submittingLabel="Listing NFT…"
            submittedLabel="NFT Listed"
          />
        </FormSection>
      </TransactionCard>
    </TransitionPane>
  );
}
