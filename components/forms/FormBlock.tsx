import { useMeasure } from 'react-use';
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import VerifiedBadge from 'assets/icons/verified-badge.svg';
import { css } from 'stitches.config';

interface FormBlockProps {
  children: ReactNode;
  title: string;
  hintText?: ReactNode;
  shouldShowBadge?: boolean;
}

const verifiedIconStyles = css({ display: 'block', marginBottom: '$6' });

export default function FormBlock(props: FormBlockProps): JSX.Element {
  const {
    children,
    title,

    hintText,
    shouldShowBadge = false,
  } = props;

  const [measureRef, { width }] = useMeasure();
  const isNarrow = width <= 620;

  return (
    <Box css={{ minWidth: 0 }}>
      {shouldShowBadge && (
        <VerifiedBadge
          key="verified"
          width={50}
          height={50}
          className={verifiedIconStyles()}
        />
      )}
      <Box ref={measureRef} />
      <Grid
        css={{
          minWidth: 0,
          gridTemplateColumns: isNarrow ? null : '250px auto',
          gap: isNarrow ? null : '$9',
        }}
      >
        <Box>
          <Heading size={3} css={{ marginBottom: '$6' }}>
            {title}
          </Heading>
          {hintText}
        </Box>
        <Box css={{ minWidth: 0 }}>{children}</Box>
      </Grid>
    </Box>
  );
}
