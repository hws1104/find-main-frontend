import { styled } from 'stitches.config';

import { ReactNode } from 'react';

import Paragraph from 'components/base/Paragraph';
import Heading from 'components/base/Heading';
import Box from 'components/base/Box';
import Grid from 'components/base/Grid';

const TransactionContentHeading = styled(Heading, {
  lineHeight: 1,
  textAlign: 'center',
  '@bp1': {
    textAlign: 'left',
  },
});

const TransactionContentGrid = styled(Grid, {
  gap: '$7',
  justifyContent: 'center',
  textAlign: 'center',
  '@bp1': {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
});

interface TransactionContentProps {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionContent(props: TransactionContentProps) {
  const { description, title, children } = props;

  return (
    <Box css={{ maxWidth: 400 }}>
      <Grid css={{ gap: '$4' }}>
        <TransactionContentHeading size={{ '@initial': 4, '@bp2': 5 }}>
          {title}
        </TransactionContentHeading>

        <TransactionContentGrid>
          <Paragraph>{description}</Paragraph>
          {children}
        </TransactionContentGrid>
      </Grid>
    </Box>
  );
}
