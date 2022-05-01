import { cond, equals, always } from 'ramda';
import { ReactNode } from 'react';

import { ModerationStatus } from 'types/Moderation';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import Body from 'components/base/Body';
import Icon from 'components/Icon';

import SuspendedIcon from 'assets/icons/suspended-icon.svg';
import UnderReviewIcon from 'assets/icons/under-review-icon.svg';
import DMCAIcon from 'assets/icons/dmca-icon.svg';
import Paragraph from 'components/base/Paragraph';
import { css } from 'stitches.config';

interface WarningBlockProps {
  title: string;
  description: ReactNode;
  icon?: ModerationStatus;
}

const iconStyles = css({ display: 'block' });

export const renderIcon = cond<ModerationStatus, JSX.Element>([
  [
    equals(ModerationStatus.Suspended),
    always(<SuspendedIcon className={iconStyles()} />),
  ],
  [
    equals(ModerationStatus.UnderReview),
    always(<UnderReviewIcon className={iconStyles()} />),
  ],
  [
    equals(ModerationStatus.TakedownRequested),
    always(<Icon icon={DMCAIcon} width={22} height={26} />),
  ],
]);

export default function WarningBlock<T extends WarningBlockProps>(
  props: T
): JSX.Element {
  const { title, description, icon } = props;
  return (
    <Body
      css={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        <Grid css={{ gap: '$7' }}>
          {icon && (
            <Flex css={{ width: 46, marginX: 'auto' }}>{renderIcon(icon)}</Flex>
          )}

          <Grid css={{ gap: '$6' }}>
            <Heading
              size={4}
              css={{ textAlign: 'center', maxWidth: 440, marginX: 'auto' }}
            >
              {title}
            </Heading>
            <Paragraph
              css={{ textAlign: 'center', maxWidth: 360, marginX: 'auto' }}
            >
              {description}
            </Paragraph>
          </Grid>
        </Grid>
      </Box>
    </Body>
  );
}
