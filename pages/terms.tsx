import RenderLegal from 'components/renderers/RenderLegal';
import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';

import { getContentfulContent } from 'queries/server/content';
import { lastUpdated } from 'utils/dates/dates';
import { TextHero } from 'components/blocks/TextHero';

import { PageType } from 'types/page';
import { GetStaticPropsResult } from 'next';

interface TermsOfServiceProps {
  terms: string;
  updatedAt: string;
}

export default function TermsOfService(
  props: TermsOfServiceProps
): JSX.Element {
  const { terms, updatedAt } = props;

  return (
    <Page title="Terms of Service" type={PageType.maximal}>
      <Body
        css={{ backgroundColor: '$white100', position: 'relative', zIndex: 1 }}
      >
        <TextHero
          heading="Terms of Service"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {terms && (
          <Box
            as="main"
            css={{
              maxWidth: 820,
              paddingX: '$7',
              marginX: 'auto',
              paddingBottom: '$10',
            }}
          >
            {RenderLegal(terms)}
          </Box>
        )}
      </Body>
    </Page>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<TermsOfServiceProps>
> {
  const { terms, updatedAt } = await getContentfulContent();

  return {
    props: {
      terms,
      updatedAt,
    },
    // 1 hour
    revalidate: 60 * 60,
  };
}
