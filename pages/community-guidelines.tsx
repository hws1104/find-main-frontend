import RenderLegal from 'components/renderers/RenderLegal';
import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';

import { getContentfulContent } from 'queries/server/content';
import { lastUpdated } from 'utils/dates/dates';
import { TextHero } from 'components/blocks/TextHero';

import { PageType } from 'types/page';
import { GetStaticPropsResult } from 'next';

interface CommunityGuidelinesProps {
  communityGuidelines: string;
  updatedAt: string;
}

export default function CommunityGuidelines(
  props: CommunityGuidelinesProps
): JSX.Element {
  const { communityGuidelines, updatedAt } = props;

  return (
    <Page title="Community Guidelines" type={PageType.maximal}>
      <Body
        css={{
          backgroundColor: '$white100',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <TextHero
          heading="Community Guidelines"
          subheading={`Last updated – ${lastUpdated(updatedAt)}`}
        />
        {communityGuidelines && (
          <Box
            as="main"
            css={{
              maxWidth: 820,
              paddingX: '$7',
              marginX: 'auto',
              paddingBottom: '$10',
            }}
          >
            {RenderLegal(communityGuidelines)}
          </Box>
        )}
      </Body>
    </Page>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CommunityGuidelinesProps>
> {
  const { communityGuidelines, updatedAt } = await getContentfulContent();

  return {
    props: {
      communityGuidelines,
      updatedAt,
    },
    // 1 hour
    revalidate: 3600,
  };
}
