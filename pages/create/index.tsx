import { GetStaticPropsResult } from 'next';
import NextLink from 'next/link';

import MobileNotSupportedModal from 'components/modals/MobileNotSupportedModal';
import Heading from 'components/base/Heading';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Card from 'components/base/Card';
import TextLink from 'components/base/TextLink';
import LoadingPage from 'components/LoadingPage';
import Paragraph from 'components/base/Paragraph';
import Icon from 'components/Icon';
import CollectionRow from 'components/create/CollectionRow';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';
import Page from 'components/Page';
import TransactionWarningBlock from 'components/trust-safety/TransactionWarningBlock';
import InviteOnlyOverlay from 'components/join/InviteOnlyOverlay';

import PlusIcon from 'assets/icons/plus-large-icon.svg';

import useUnsupportedFlow from 'hooks/use-unsupported-flow';
import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import { useUserAvailableCollections } from 'hooks/queries/hasura/use-user-collections';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';

import { getNFT721Address } from 'lib/addresses';
import { isAnyTrue, isEmptyOrNil } from 'utils/helpers';
import { PageType } from 'types/page';
import { ModerationStatus } from 'types/Moderation';

CreatePage.getLayout = TransactionLayoutV2({
  title: 'Create on Foundation',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
});

export default function CreatePage(): JSX.Element {
  // Mobile not supported
  useUnsupportedFlow();

  const { data: user } = useWalletSession();

  const publicAddress = user?.publicAddress;

  const { data: userData, isLoading: userIsLoading } = useUserByPublicKey({
    publicKey: publicAddress,
  });

  const {
    isUserModerated,
    isLoading: isModerationStatusLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const serverUser = userData?.user;

  const isApprovedCreator = serverUser?.isApprovedCreator;

  const { data: availableCollectionsData, isLoading: isCollectionsLoading } =
    useUserAvailableCollections(
      { publicKey: publicAddress },
      {
        enabled: Boolean(publicAddress),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        initialData: {
          fndCollections: [],
          userCollections: [],
        },
      }
    );

  const fndCollectionData = availableCollectionsData?.find(
    (collections) => collections.contractAddress === getNFT721Address()
  );

  const userCollectionsData = availableCollectionsData?.filter(
    (collections) => collections.contractAddress !== getNFT721Address()
  );

  const isLoading = isAnyTrue([
    isCollectionsLoading,
    userIsLoading,
    isModerationStatusLoading,
  ]);

  if (isUserModerated && moderationStatus === ModerationStatus.UnderReview) {
    return (
      <Page title="Under Review">
        <TransactionWarningBlock moderationStatus={moderationStatus} />
      </Page>
    );
  }

  if (isUserModerated && moderationStatus === ModerationStatus.Suspended) {
    return (
      <Page title="Permanently Removed">
        <TransactionWarningBlock moderationStatus={moderationStatus} />
      </Page>
    );
  }

  return (
    <>
      <MobileNotSupportedModal />

      {isLoading ? (
        <LoadingPage
          css={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 999,
            transform: 'translate(-50%, -50%)',
            padding: 0,
          }}
        />
      ) : (
        <InviteOnlyOverlay enabled={!isApprovedCreator}>
          <>
            <Heading
              size={5}
              css={{
                textAlign: 'center',
                marginBottom: '$6',
                marginTop: '$9',
              }}
            >
              Create on Foundation
            </Heading>
            <Flex
              css={{
                maxWidth: 480,
                width: 480,
                justifyContent: 'center',
                flexDirection: 'column',
                marginX: 'auto',
                marginBottom: '$9',
              }}
            >
              {isEmptyOrNil(userCollectionsData) ? (
                <NextLink href="/create/collection" passHref>
                  <Card
                    as="a"
                    isInteractive
                    css={{
                      paddingX: '$9',
                      paddingY: '$7',
                      textAlign: 'center',
                      textDecoration: 'none',
                      color: 'currentColor',
                    }}
                  >
                    <Flex
                      css={{
                        height: 80,
                        width: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '$black5',
                        color: '$black100',
                        borderRadius: '$2',
                        marginX: 'auto',
                        marginBottom: '$5',
                      }}
                    >
                      <Icon icon={PlusIcon} width={24} height={24} />
                    </Flex>
                    <Text size={2} weight={600} css={{ marginBottom: '$1' }}>
                      Create a new collection
                    </Text>
                    <Paragraph css={{ color: '$black60', maxWidth: 320 }}>
                      Deploy a smart contract to showcase NFTs.
                    </Paragraph>
                  </Card>
                </NextLink>
              ) : (
                <>
                  <Text
                    weight={600}
                    size={2}
                    css={{
                      borderBottom: '1px solid $black10',
                      paddingBottom: '$3',
                      marginBottom: '$5',
                      marginTop: '$8',
                    }}
                  >
                    Mint to your collections
                  </Text>
                  <NextLink href="/create/collection" passHref>
                    <Card
                      as="a"
                      isInteractive
                      css={{
                        display: 'flex',
                        padding: '$4',
                        color: 'currentColor',
                        textDecoration: 'none',
                        width: '100%',
                        marginBottom: '$4',
                      }}
                    >
                      <Flex
                        css={{
                          height: 80,
                          width: 80,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '$black5',
                          color: '$black100',
                          borderRadius: '$2',
                        }}
                      >
                        <Icon icon={PlusIcon} width={24} height={24} />
                      </Flex>
                      <Flex
                        css={{
                          marginLeft: '$4',
                          alignItems: 'center',
                        }}
                      >
                        <Text size={2} weight={600}>
                          Create new collection
                        </Text>
                      </Flex>
                    </Card>
                  </NextLink>
                  {userCollectionsData.map((collection) => (
                    <CollectionRow
                      key={collection.id}
                      data={collection}
                      css={{ marginBottom: '$4' }}
                    />
                  ))}
                </>
              )}

              <Text
                weight={600}
                size={2}
                css={{
                  borderBottom: '1px solid $black10',
                  paddingBottom: '$3',
                  marginBottom: '$5',
                  marginTop: '$8',
                }}
              >
                Mint to shared collection
              </Text>
              <CollectionRow data={fndCollectionData} />

              <TextLink
                css={{
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '$black60',
                  maxWidth: 240,
                  marginX: 'auto',
                  marginTop: '$7',
                  textDecoration: 'none',
                }}
                href="https://help.foundation.app/en/collections/3154781-collections"
                target="_blank"
              >
                Learn more about collections on Foundation
              </TextLink>
            </Flex>
          </>
        </InviteOnlyOverlay>
      )}
    </>
  );
}
