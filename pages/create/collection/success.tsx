import { css } from 'stitches.config';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Body from 'components/base/Body';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Text from 'components/base/Text';
import ConfettiCanvas from 'components/ConfettiCanvas';
import Icon from 'components/Icon';
import ExternalLink from 'components/links/ExternalLink';
import ExternalLinkIcon from 'assets/icons/external-link.svg';
import Page from 'components/Page';
import CollectionCard from 'components/cards/collections/CollectionCard';
import { TransactionLayoutGrid } from 'components/layouts/TransactionLayoutV2';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

import useCollectionByContractAddress from 'hooks/queries/hasura/collections/use-collection-by-contract-address';

import { PageType } from 'types/page';

import { getFirstValue } from 'utils/helpers';

const externalLinkStyles = css({
  display: 'flex',
  alignItems: 'center',
});

export default function CreateCollectionSuccess(): JSX.Element {
  const router = useRouter();

  const contractAddress = getFirstValue(router.query.contractAddress);
  const txHash = getFirstValue(router.query.txHash);

  const { data: collectionData } = useCollectionByContractAddress({
    contractAddress,
  });

  const collectionSlug = collectionData?.slug;

  return (
    <Page type={PageType.minimalLoggedIn} title="Your collection is created">
      <Body
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ConfettiCanvas fireConfetti={true} />
        <TransactionLayoutGrid reversed css={{ alignItems: 'center' }}>
          <Box>
            {collectionData && (
              <CollectionCard
                collection={collectionData}
                creator={collectionData?.creator}
              />
            )}
          </Box>
          <Box>
            <Heading size={6} css={{ marginBottom: '$7', lineHeight: 1 }}>
              Your smart contract was created!
            </Heading>
            <Paragraph css={{ maxWidth: 380, marginBottom: '$7' }}>
              Congratulations! Your smart contract has been deployed to the
              Ethereum blockchain.
            </Paragraph>
            <Box css={{ maxWidth: 340 }}>
              <Link href={`/collection/${collectionSlug}`} passHref>
                <Button
                  as="a"
                  color="black"
                  size="large"
                  shape="regular"
                  hoverable
                >
                  View your collection
                </Button>
              </Link>
              <Flex css={{ paddingTop: '$7' }}>
                <ExternalLink
                  rel="noopener noreferrer"
                  target="_blank"
                  href={buildEtherscanLink(`/tx/${txHash}`)}
                  className={externalLinkStyles()}
                >
                  <Icon icon={ExternalLinkIcon} width={16} height={16} />
                  <Text css={{ marginLeft: '$3' }}>View on Etherscan</Text>
                </ExternalLink>
              </Flex>
            </Box>
          </Box>
        </TransactionLayoutGrid>
      </Body>
    </Page>
  );
}
