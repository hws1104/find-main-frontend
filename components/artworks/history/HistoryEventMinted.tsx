import { buildEtherscanLink } from 'lib/etherscanAddresses';

import { getTransactionHash } from 'utils/events';
import { areKeysEqual } from 'utils/users';

import HistoryEventAmount from 'components/artworks/history/HistoryEventAmount';
import HistoryEventRow from 'components/artworks/history/HistoryEventRow';
import HistoryEventDetails from 'components/artworks/history/HistoryEventDetails';
import HistoryEventUserLink from 'components/artworks/history/HistoryEventUserLink';
import HistoryEventAvatars from './HistoryEventAvatars';
import EtherscanIconLink from 'components/links/EtherscanIconLink';
import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';
import HistoryInfo from './HistoryInfo';
import HistoryDetails from './HistoryDetails';

import { HistoryEventProps } from './types';

export default function HistoryEventMinted(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, userFrom, userTo } = props;

  const isMintedByCreator = areKeysEqual([
    userFrom?.publicKey,
    userTo?.publicKey,
  ]);

  const transactionHash = getTransactionHash(historyEvent);

  if (isMintedByCreator) {
    return (
      <HistoryEventGeneric label="Minted by" historyEvent={historyEvent} />
    );
  }

  return (
    <HistoryEventRow>
      <HistoryEventAvatars users={[userFrom, userTo]} />

      <HistoryInfo>
        <HistoryDetails>
          <HistoryEventDetails date={historyEvent.blockTimestamp}>
            Minted by <HistoryEventUserLink user={userFrom} /> to{' '}
            <HistoryEventUserLink user={userTo} />
          </HistoryEventDetails>
        </HistoryDetails>

        {historyEvent.data.amountInETH && (
          <HistoryEventAmount amountInETH={historyEvent.data.amountInETH} />
        )}
      </HistoryInfo>

      {transactionHash && (
        <EtherscanIconLink
          href={buildEtherscanLink(`/tx/${transactionHash}`)}
        />
      )}
    </HistoryEventRow>
  );
}
