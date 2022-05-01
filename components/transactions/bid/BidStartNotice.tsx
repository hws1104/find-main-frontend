import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import Paragraph from 'components/base/Paragraph';

import BidLearnLink from './BidLearnLink';

export default function BidStartNotice(): JSX.Element {
  return (
    <Grid css={{ gap: 10 }}>
      <Paragraph>
        Placing this bid will start a 24 hour auction for the artwork. Once a
        bid is placed, it cannot be withdrawn.
      </Paragraph>
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
