import Grid from 'components/base/Grid';
import TextLink from 'components/base/TextLink';
import Paragraph from 'components/base/Paragraph';

interface ListInfoProps {
  infoSections: [string, string];
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ListInfo(props: ListInfoProps) {
  const { infoSections } = props;

  return (
    <Grid
      css={{
        gap: '$5',
        '@bp1': {
          gridTemplateColumns: '1fr 1fr',
        },
      }}
    >
      {infoSections.map((infoSection, key) => (
        <Paragraph size="sub" key={key} css={{ color: '$black60' }}>
          {infoSection}
        </Paragraph>
      ))}
    </Grid>
  );
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function ListHelpArticleLink() {
  return (
    <TextLink
      as="a"
      target="_blank"
      rel="noreferrer"
      href="https://help.foundation.app/en/articles/4742888-a-complete-guide-to-listing-an-nft-for-auction"
    >
      Learn how our auctions work.
    </TextLink>
  );
}
