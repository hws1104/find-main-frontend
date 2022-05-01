/* eslint-disable react/jsx-max-depth */
import { HistoryEventProps } from './types';

import { buildEtherscanLink } from 'lib/etherscanAddresses';
import { getTransactionHash } from 'utils/events';

import HistoryEventAmount from 'components/artworks/history/HistoryEventAmount';
import HistoryEventRow from 'components/artworks/history/HistoryEventRow';
import HistoryEventDetails from 'components/artworks/history/HistoryEventDetails';
import HistoryEventUserLink from 'components/artworks/history/HistoryEventUserLink';
import EtherscanIconLink from 'components/links/EtherscanIconLink';
import HistoryEventAvatars from './HistoryEventAvatars';
import Icon from 'components/Icon';
import HistoryInfo from './HistoryInfo';
import HistoryDetails from './HistoryDetails';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import PrivateSaleIcon from 'assets/icons/private-sale.svg';

interface HistoryEventPrivateSaleProps extends HistoryEventProps {
  label: string;
}

export default function HistoryEventPrivateSale(
  props: HistoryEventPrivateSaleProps
): JSX.Element {
  const { historyEvent, userFrom, userTo } = props;

  const transactionHash = getTransactionHash(historyEvent);

  return (
    <HistoryEventRow css={{ justifyContent: 'space-between' }}>
      <Box>
        <HistoryInfo>
          <HistoryDetails>
            <Flex
              css={{
                alignItems: 'center',
                flexShrink: 0,
                marginBottom: '$1',
              }}
            >
              <Box
                css={{
                  display: 'none',
                  marginRight: '$2',
                  flexShrink: 0,
                  '@bp1': {
                    display: 'block',
                  },
                }}
              >
                <Icon icon={PrivateSaleIcon} width={22} height={20} />
              </Box>
              <HistoryEventAvatars users={[userFrom, userTo]} />
            </Flex>
          </HistoryDetails>
        </HistoryInfo>
        <Box css={{ alignSelf: 'flex-start' }}>
          <HistoryEventDetails date={historyEvent.blockTimestamp}>
            Sold in a private sale to <HistoryEventUserLink user={userTo} />
          </HistoryEventDetails>
        </Box>
      </Box>
      <Flex css={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
        {historyEvent.data.amountInETH && (
          <HistoryEventAmount amountInETH={historyEvent.data.amountInETH} />
        )}
        {transactionHash && (
          <EtherscanIconLink
            href={buildEtherscanLink(`/tx/${transactionHash}`)}
          />
        )}
      </Flex>
    </HistoryEventRow>
  );
}
