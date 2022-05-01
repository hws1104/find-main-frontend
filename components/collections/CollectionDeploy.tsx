import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Flex from 'components/base/Flex';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Text from 'components/base/Text';
import SpinnerStroked from 'components/SpinnerStroked';
import ExternalLink from 'components/links/ExternalLink';
import Icon from 'components/Icon';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';

import ExternalLinkIcon from 'assets/icons/external-link.svg';

import { css, styled } from 'stitches.config';

import { buildEtherscanLink } from 'lib/etherscanAddresses';
import BackButton from './BackButton';
import Badge from 'components/base/Badge';

const FormSection = styled(Box, {
  paddingX: '$8',
});
export interface CollectionDeployProps {
  onBackClick: () => void;
  txHash: string;
  isLoading: boolean;
  contractAddress: string;
}

export default function CollectionDeploy(
  props: CollectionDeployProps
): JSX.Element {
  const { txHash, contractAddress, isLoading, onBackClick } = props;

  if (txHash) {
    return (
      <CollectionDeploying contractAddress={contractAddress} txHash={txHash} />
    );
  }

  // TODO: think about renaming this prop to be clearer (awaiting tx)
  if (isLoading) {
    return <CollectionDeployRequest />;
  }

  return (
    <>
      <TransactionCard css={{ paddingY: '$8' }}>
        <FormSection css={{ paddingBottom: '$7' }}>
          <Heading size={4} css={{ maxWidth: 360, marginBottom: '$5' }}>
            Deploy your smart contract
          </Heading>
          <Paragraph css={{ maxWidth: 390 }}>
            Finalize your smart contract by deploying it to the Ethereum
            blockchain. Once you deploy your collection name and symbol, they
            cannot be updated or changed.
          </Paragraph>
        </FormSection>

        <FormSection css={{ marginTop: 'auto' }}>
          <Button
            type="submit"
            size="large"
            shape="regular"
            color="black"
            hoverable
            css={{ width: '100%' }}
          >
            Deploy your contract
          </Button>
        </FormSection>
      </TransactionCard>

      <BackButton onClick={onBackClick} />
    </>
  );
}

function CollectionDeployRequest() {
  return (
    <TransactionCard css={{ paddingX: '$9', paddingY: '$8' }}>
      <Flex css={{ marginBottom: '$7' }}>
        <SpinnerStroked size={32} />
      </Flex>

      <Heading size={4} css={{ marginBottom: '$7' }}>
        Deploy your smart contract
      </Heading>
      <Paragraph css={{ maxWidth: 340, marginBottom: '$7' }}>
        Confirm this transaction in your wallet to deploy your collection smart
        contract to the Ethereum blockchain.
      </Paragraph>

      <Flex css={{ marginTop: 'auto' }}>
        <Badge color="gray">Confirm via your wallet…</Badge>
      </Flex>
    </TransactionCard>
  );
}

interface CollectionDeployingProps {
  txHash: string;
  contractAddress: string;
}

const externalLinkStyles = css({
  display: 'flex',
  alignItems: 'center',
});

function CollectionDeploying(props: CollectionDeployingProps) {
  const { txHash } = props;

  return (
    <TransactionCard css={{ paddingX: '$9', paddingY: '$8' }}>
      <Flex css={{ marginBottom: '$7' }}>
        <SpinnerStroked size={32} />
      </Flex>

      <Heading size={4} css={{ marginBottom: '$7', maxWidth: 360 }}>
        Your smart contract is being created…
      </Heading>
      <Paragraph css={{ maxWidth: 340, marginBottom: '$7' }}>
        The smart contract is being deployed to the Ethereum mainnet.
      </Paragraph>
      <Box css={{ marginTop: 'auto' }}>
        <ExternalLink
          rel="noopener noreferrer"
          target="_blank"
          href={buildEtherscanLink(`/tx/${txHash}`)}
          className={externalLinkStyles()}
        >
          <Icon icon={ExternalLinkIcon} width={16} height={16} />
          <Text css={{ marginLeft: '$3' }}>View on Etherscan</Text>
        </ExternalLink>
      </Box>
    </TransactionCard>
  );
}
