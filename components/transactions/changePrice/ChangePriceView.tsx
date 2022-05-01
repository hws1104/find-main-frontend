/* eslint-disable react/jsx-max-depth */
import ChangePriceForm from 'components/transactions/changePrice/ChangePriceForm';
import SubmitButton from 'components/forms/SubmitButton';
import ETHField from 'components/forms/fields/ETHField';
import ETHinUSDField from 'components/forms/fields/ETHinUSDField';
import ExternalLink from 'components/links/ExternalLink';

import { ChangePriceFormValues } from './types';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';

interface ChangePriceViewProps {
  onSubmit: (values: ChangePriceFormValues) => void;
  artwork: ArtworkFragmentExtended;
}

export default function ChangePriceView(
  props: ChangePriceViewProps
): JSX.Element {
  const { onSubmit, artwork } = props;

  return (
    <>
      <ChangePriceForm
        onSubmit={onSubmit}
        initialValues={{
          price: '',
          name: artwork?.name,
        }}
      >
        <Box
          css={{
            padding: '$8',
            boxShadow: '$0',
            borderRadius: '$2',
            backgroundColor: '$white100',
          }}
        >
          <Box css={{ marginBottom: '$8' }}>
            <Heading size={3} css={{ marginBottom: '$7' }}>
              Change reserve price
            </Heading>
            <Grid css={{ maxWidth: 410, gridGap: '$6' }}>
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
            <Flex css={{ marginBottom: '$8' }}>
              <ExternalLink
                rel="noopener noreferrer"
                target="_blank"
                href="https://help.foundation.app/en/articles/4742888-a-complete-guide-to-listing-an-nft-for-auction"
              >
                Learn how our auctions work.
              </ExternalLink>
            </Flex>
          </Box>
          <Box
            css={{
              paddingTop: '$4',
            }}
          >
            <SubmitButton disableIfInvalid css={{ width: '100%' }}>
              Change reserve price
            </SubmitButton>
          </Box>
        </Box>
      </ChangePriceForm>
    </>
  );
}
