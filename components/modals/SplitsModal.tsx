/* eslint-disable react/jsx-max-depth */
import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Grid from 'components/base/Grid';
import SplitsBreakdown from 'components/splits/SplitsBreakdown';
import TransactionHashLink from 'components/transactions/TransactionHashLink';
import TextLink from 'components/base/TextLink';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';

import SplitIcon from 'assets/icons/split-icon.svg';

import { ModalKey } from 'types/modal';
import { ArtworkPageSplitRecipient } from 'queries/server/artwork-page';
import { getFirstValue } from 'utils/helpers';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

interface SplitsModalProps {
  percentSplits: ArtworkPageSplitRecipient[];
}

export default function SplitsModal(props: SplitsModalProps): JSX.Element {
  const { percentSplits } = props;

  const firstSplit = getFirstValue(percentSplits);

  return (
    <ModalContainer modalKey={ModalKey.ARTWORK_SPLITS}>
      <ModalContent
        css={{
          maxWidth: 520,
          paddingBottom: '$8',
          '@bp1': {
            paddingX: '$9',
            paddingBottom: '$9',
            paddingTop: '$8',
          },
        }}
      >
        <Grid>
          <Grid
            css={{
              gap: '$5',
              marginBottom: '$7',
              '@bp1': {
                marginBottom: '$8',
              },
            }}
          >
            <Flex css={{ alignItems: 'center' }}>
              <Icon
                icon={SplitIcon}
                width={36}
                height={31}
                style={{ top: 3 }}
              />
              <Heading
                tracking="tight"
                leading="tight"
                size={{ '@initial': 4, '@bp1': 5 }}
                css={{ marginLeft: '$4' }}
              >
                Split
              </Heading>
            </Flex>

            <Paragraph css={{ maxWidth: 320 }}>
              Split Earnings are automatically deposited into each recipient’s
              wallet.{' '}
              <TextLink
                as="a"
                target="_blank"
                rel="noreferrer"
                href="https://help.foundation.app/en/articles/5305276-how-can-i-create-a-split-on-foundation"
                css={{ display: 'inline' }}
              >
                Learn more →
              </TextLink>
            </Paragraph>
          </Grid>
          <Grid
            css={{
              marginBottom: '$8',
              '@bp1': {
                marginBottom: '$9',
              },
            }}
          >
            <SplitsBreakdown splits={percentSplits} />
          </Grid>
          {firstSplit && (
            <TransactionHashLink
              href={buildEtherscanLink(
                `/address/${firstSplit.contractAddress}`
              )}
              txHash={firstSplit.contractAddress}
            />
          )}
        </Grid>
      </ModalContent>
    </ModalContainer>
  );
}
