import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Text from 'components/base/Text';

import { InviteCodeFragment } from 'graphql/server/server-fragments.generated';

import InviteCodeCopyButton from './InviteCodeCopyButton';
import { CSS } from 'stitches.config';
import Mono from 'components/base/Mono';

interface InviteCodeRowProps {
  inviteCode: InviteCodeFragment;
  css?: CSS;
}

export default function InviteCodeRow(props: InviteCodeRowProps): JSX.Element {
  const { inviteCode, css } = props;

  const isDisabled = Boolean(inviteCode?.redeemedAt);

  return (
    <Flex
      style={{
        opacity: isDisabled ? 0.3 : 1,
        pointerEvents: isDisabled ? 'none' : 'all',
      }}
      css={{
        boxShadow: '$0',
        paddingLeft: '$6',
        paddingRight: '$4',
        paddingY: '$4',
        borderRadius: '$2',
        backgroundColor: '$white100',
        display: 'grid',
        gap: '$4',
        '@bp0': {
          paddingLeft: '$7',
          paddingRight: '$6',
          paddingY: '$6',
          justifyContent: 'space-between',
          display: 'flex',
          gap: 0,
        },
        ...(css as any),
      }}
    >
      <Grid css={{ gap: '$2' }}>
        <Text>Invite Code</Text>
        <Mono tight>{inviteCode.inviteCode}</Mono>
      </Grid>
      <Box>
        <InviteCodeCopyButton
          isDisabled={isDisabled}
          inviteCode={inviteCode?.inviteCode}
        />
      </Box>
    </Flex>
  );
}
