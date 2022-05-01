/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { styled, css } from 'stitches.config';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isPast } from 'date-fns';
import { useLocation } from 'react-use';

import { useArtworkByContractTokenIdFromRouter } from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import usePrivateSaleByIpfs from 'hooks/queries/hasura/use-private-sale-by-ipfs';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import UserTagV2 from 'components/users/UserTagV2';
import FollowPopover from 'components/follows/FollowPopover';
import PrivateSaleCountdown from './PrivateSaleCountdown';
import PrivateSaleCopyToClipboard from './PrivateSaleCopyToClipboard';
import FieldHeading from 'components/forms/FieldHeading';
import LoadingPage from 'components/LoadingPage';
import Button from 'components/base/Button';

import { TransactionFormContainer } from '../TransactionContainerV2';
import TransactionSplitPane from '../TransactionSplitPane';
import TransactionPane from 'components/transactions/TransactionPane';
import TransactionHeading from 'components/transactions/TransactionHeading';
import TransactionSection from 'components/transactions/TransactionSection';
import TransactionIPFSLink from 'components/transactions/TransactionIPFSLink';

import {
  getFirstValue,
  isAnyTrue,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { buildUserProfilePath } from 'utils/artwork/artwork';

const BodyText = styled(Text, { fontFamily: '$body', lineHeight: 1.8 });

const ShareLinkText = styled(Text, {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontFamily: '$body',
});

const copyToClipboardStyles = css({ maxWidth: 360 })();

export default function PrivateSaleSubmittedContainer(): JSX.Element {
  const router = useRouter();
  const ipfsHash = getFirstValue(router.query.ipfsHash);

  const location = useLocation();

  const { data: artworkData, isLoading: isArtworkLoading } =
    useArtworkByContractTokenIdFromRouter();

  const { data: privateSaleData, isLoading: isPrivateSaleDataLoading } =
    usePrivateSaleByIpfs({ ipfsHash }, { refetchInterval: 10000 });

  const isLoading = isAnyTrue([isArtworkLoading, isPrivateSaleDataLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const isExpired = isPast(new Date(`${privateSaleData?.deadlineAt}Z`));

  return (
    <TransactionFormContainer>
      <TransactionSplitPane
        css={{ display: 'block', '@bp1': { display: 'grid' } }}
      >
        <Box css={{ display: 'none', '@bp1': { display: 'block' } }}>
          <ArtworkCardMinimal
            artwork={artworkData}
            creator={artworkData?.creator}
          />
        </Box>
        <TransactionPane
          css={{
            display: 'block',
            paddingY: '$9',
            marginTop: '$9',
            '@bp1': { marginTop: 0 },
          }}
        >
          <>
            <TransactionSection css={{ marginBottom: '$9' }}>
              <TransactionHeading>
                Your private sale has been sent!
              </TransactionHeading>
              <BodyText css={{ marginBottom: '$4', maxWidth: 400 }}>
                Your private sale has been sent to the collector. If accepted,
                the NFT will be added to their collection and funds will be
                automatically deposited into your wallet.
              </BodyText>
            </TransactionSection>

            <TransactionSection
              css={{
                marginBottom: '$8',
                paddingBottom: '$8',
                borderBottom: '1px solid $black5',
              }}
            >
              <Box
                css={{
                  '@bp1': { display: 'flex' },
                  marginBottom: '$7',
                }}
              >
                <Box
                  css={{
                    marginBottom: '$8',
                    '@bp1': {
                      borderRight: '1px solid $black5',
                      paddingRight: '$8',
                      marginBottom: 0,
                    },
                  }}
                >
                  <FieldHeading>Sent to</FieldHeading>
                  <Flex css={{ alignItems: 'center' }}>
                    <Link
                      href={buildUserProfilePath({
                        user: privateSaleData?.buyer,
                      })}
                      passHref
                    >
                      <a
                        style={{ textDecoration: 'none' }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FollowPopover
                          publicKey={publicKeyOrIdOrAddress(
                            privateSaleData?.buyer
                          )}
                        >
                          <UserTagV2
                            user={privateSaleData?.buyer}
                            isLoading={isPrivateSaleDataLoading}
                            hoverable
                          />
                        </FollowPopover>
                      </a>
                    </Link>
                  </Flex>
                </Box>

                <Box css={{ '@bp1': { paddingLeft: '$8' } }}>
                  <FieldHeading>
                    {isExpired ? 'Expired on' : 'Expires in'}
                  </FieldHeading>
                  <PrivateSaleCountdown
                    timestamp={privateSaleData?.deadlineAt}
                  />
                </Box>
              </Box>

              <Box>
                <TransactionIPFSLink ipfsHash={ipfsHash} />
              </Box>
            </TransactionSection>

            <TransactionSection css={{ paddingBottom: '$9' }}>
              <TransactionHeading size="small" css={{ marginBottom: '$7' }}>
                Send your private sale link
              </TransactionHeading>
              <Grid css={{ gap: '$6' }}>
                <PrivateSaleCopyToClipboard
                  textToCopy={`${location.origin}/sale/${ipfsHash}`}
                  className={copyToClipboardStyles}
                >
                  <ShareLinkText>foundation.app/sale/{ipfsHash}</ShareLinkText>
                </PrivateSaleCopyToClipboard>

                <BodyText css={{ maxWidth: 400 }}>
                  Copy the private sale link above and send it to the collector
                  via Twitter DM, email, or text message.
                </BodyText>
              </Grid>
            </TransactionSection>

            <TransactionSection
              css={{ paddingTop: '$8', borderTop: '1px solid $black5' }}
            >
              <Link href="/activity" passHref>
                <Button
                  as="a"
                  color="white"
                  size="large"
                  shape="regular"
                  hoverable
                  css={{ width: '100%' }}
                >
                  View in Activity
                </Button>
              </Link>
            </TransactionSection>
          </>
        </TransactionPane>
      </TransactionSplitPane>
    </TransactionFormContainer>
  );
}
