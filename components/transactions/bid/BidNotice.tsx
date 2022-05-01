import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';

import BidLearnLink from './BidLearnLink';

export default function BidNotice(): JSX.Element {
  return (
    <Grid css={{ gap: 10 }}>
      <Paragraph>Once a bid is placed, it cannot be withdrawn.</Paragraph>
      <Flex
        css={{
          justifyContent: 'center',
          '@bp1': { justifyContent: 'flex-start' },
        }}
      >
        <BidLearnLink />
      </Flex>
    </Grid>
  );
}
