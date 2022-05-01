/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { styled } from 'stitches.config';

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
import ListInfo, {
  ListHelpArticleLink,
} from 'components/transactions/list/ListInfo';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';

import { ListFormValues } from './types';

const FormSection = styled(Box, {
  paddingX: 72,
});

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListFieldsPrimary() {
  return (
    <TransitionPane>
      <TransactionCard css={{ paddingY: 72 }}>
        <FormSection css={{ paddingBottom: '$8' }}>
          <Heading size={4} css={{ marginBottom: '$7' }}>
            Set a reserve price
          </Heading>

          <Box>
            <Grid css={{ gap: '$6', maxWidth: 410 }}>
              <ETHField placeholder="1" name="price" />
              <Text size={2} weight={600} css={{ color: '$black60' }}>
                <ETHinUSDField name="price" />
              </Text>
            </Grid>
            <Paragraph
              css={{ marginBottom: '$6', maxWidth: 440, paddingTop: '$6' }}
            >
              This price will be made public. Bidders will not be able to bid
              below this price. Once a bid has been placed, a 24 hour auction
              for the piece will begin.
            </Paragraph>
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
              'A 15% service fee will be charged based on the final sale price of the artwork.',
              'While your NFT is listed on Foundation, it will be escrowed within Foundation’s smart contracts.',
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
