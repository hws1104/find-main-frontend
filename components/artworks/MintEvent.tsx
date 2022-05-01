import { buildEtherscanLink } from 'lib/etherscanAddresses';

import ExternalLinkIcon from 'assets/icons/external-link.svg';

import { formatDateOnlyShort } from 'utils/dates/dates';
import { getTransactionHash } from 'utils/events';

import { ArtworkEvent } from 'types/Event';

import TextLink from 'components/base/TextLink';

interface MintEventProps {
  mintEvent: ArtworkEvent;
}

export default function MintEvent(props: MintEventProps): JSX.Element {
  const { mintEvent } = props;

  const transactionHash = getTransactionHash(mintEvent);
  return (
    <TextLink
      href={buildEtherscanLink(`/tx/${transactionHash}`)}
      css={{
        fontSize: '$1',
        marginTop: '$4',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      Minted on {formatDateOnlyShort(mintEvent.blockTimestamp)}
      <ExternalLinkIcon height={16} width={16} style={{ marginLeft: 8 }} />
    </TextLink>
  );
}
