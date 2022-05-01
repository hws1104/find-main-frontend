import Box from 'components/base/Box';
import Body from 'components/base/Body';

import { TextHero } from 'components/blocks/TextHero';
import RenderLegal from 'components/renderers/RenderLegal';

import { getContentfulContent } from 'queries/server/content';
import { lastUpdated } from 'utils/dates/dates';
import Page from 'components/Page';

import { PageType } from 'types/page';
import { GetStaticPropsResult } from 'next';

interface PrivacyPolicyProps {
  privacy: string;
  updatedAt: string;
}

export default function PrivacyPolicy(props: PrivacyPolicyProps): JSX.Element {
  const { privacy, updatedAt } = props;

  return (
    <Page title="Privacy Policy" type={PageType.maximal}>
      <Body
        css={{
          backgroundColor: '$white100',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <TextHero
          heading="Privacy Policy"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {privacy && (
          <Box
            as="main"
            css={{
              maxWidth: 820,
              paddingX: '$7',
              marginX: 'auto',
              paddingBottom: '$10',
            }}
          >
            {RenderLegal(privacy)}
          </Box>
        )}
      </Body>
    </Page>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PrivacyPolicyProps>
> {
  const { privacy, updatedAt } = await getContentfulContent();

  return {
    props: {
      privacy: privacy ?? null,
      updatedAt: updatedAt ?? null,
    },
    //  1 hour
    revalidate: 60 * 60,
  };
}
