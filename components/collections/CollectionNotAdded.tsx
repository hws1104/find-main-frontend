import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Button from 'components/base/Button';
import Paragraph from 'components/base/Paragraph';

export default function CollectionNotAdded(): JSX.Element {
  return (
    <Page title="Nothing to see here">
      <Body css={{ display: 'flex', alignItems: 'center' }}>
        <Box css={{ maxWidth: 400, marginX: 'auto', textAlign: 'center' }}>
          <Heading size={4} css={{ marginBottom: '$5' }}>
            Nothing to see here.
          </Heading>
          <Paragraph css={{ marginBottom: '$7' }}>
            The collection you're looking for is not yet on Foundation. If you'd
            like to see it here, let us know by submitting the form below.
          </Paragraph>

          <Button
            as="a"
            color="black"
            size="large"
            shape="regular"
            hoverable
            href="https://withfoundation.typeform.com/to/IZo42JBF"
            target="_blank"
            css={{ display: 'inline-flex' }}
          >
            Recommend a collection
          </Button>
        </Box>
      </Body>
    </Page>
  );
}
