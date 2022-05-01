import { cond, equals, always } from 'ramda';

import { renderIcon } from 'components/trust-safety/WarningBlock';

import { ModerationStatus } from 'types/Moderation';

import Text from 'components/base/Text';
import Box from 'components/base/Box';

interface ModerationBannerProps {
  status: ModerationStatus;
  reviewText: string;
  suspendedText: string;
  takedownText: string;
}

export default function ModerationBanner(
  props: ModerationBannerProps
): JSX.Element {
  const { status, reviewText, suspendedText, takedownText } = props;

  const getInfo = cond([
    [equals(ModerationStatus.Suspended), always(suspendedText)],
    [equals(ModerationStatus.UnderReview), always(reviewText)],
    [equals(ModerationStatus.TakedownRequested), always(takedownText)],
  ]);

  return (
    <Box
      css={{
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: '$white100',
        paddingX: '$6',
        paddingY: '$4',
        zIndex: 10000,
        boxShadow: '$0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box css={{ width: 22 }}>{renderIcon(status)}</Box>
      <Text weight={600} size={1} css={{ marginLeft: '$4' }}>
        {getInfo(status)}
      </Text>
    </Box>
  );
}
