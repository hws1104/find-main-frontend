/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { styled, theme } from 'stitches.config';
import { useState } from 'react';
import { length } from 'ramda';

import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Page from 'components/Page';
import Body from 'components/base/Body';
import {
  PrimaryBidsTable,
  PrivateSalesTable,
  SecondaryBidsTable,
} from 'components/bids/BidsTable';
import BidsEmptyState from 'components/bids/BidsEmptyState';
import LoadingPage from 'components/LoadingPage';
import { Tab, TabsWithLabels } from 'components/tabs/Tabs';
import ProfileCollectionTabLabel from 'components/profiles/ProfileCollectionTabLabel';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUserPrivateSales from 'hooks/queries/hasura/use-user-private-sales';

import { isAnyTrue, notEmptyOrNil } from 'utils/helpers';

import { PageType } from 'types/page';

import useUserBids from 'hooks/queries/hasura/bids/use-user-bids';
import useBodyColor from 'hooks/use-body-color';

enum BidTab {
  BidsPlaced = 'Bids Placed',
  BidsReceived = 'Bids Received',
}

enum PrivateSalesTab {
  Sent = 'Sent',
  Received = 'Received',
}

const PageHeading = styled(Heading, {
  textAlign: 'center',
  marginBottom: '$8',
  '@bp1': {
    paddingTop: '$8',
    marginBottom: '$10',
  },
});

const SectionHeading = styled(Heading, {
  textAlign: 'center',
  marginBottom: '$6',
  '@bp1': {
    marginBottom: '$7',
  },
});

export default function Activity(): JSX.Element {
  const { data: user, isLoading: userLoading } = useWalletSession();
  useBodyColor(theme.colors.black5.value);

  const publicAddress = user?.publicAddress;

  const [currentTab, setCurrentTab] = useState<string>(BidTab.BidsPlaced);

  const [currentTabSales, setCurrentTabSales] = useState<string>(
    PrivateSalesTab.Sent
  );

  const { data: privateSalesData, isLoading: privateSalesLoading } =
    useUserPrivateSales({
      publicKey: publicAddress,
    });

  const privateSalesSelling = privateSalesData?.privateSalesSelling ?? [];
  const privateSalesBuying = privateSalesData?.privateSalesBuying ?? [];

  const { data: bidsData, isLoading: isBidsLoading } = useUserBids({
    publicKey: publicAddress,
  });

  const isLoading = isAnyTrue([
    !privateSalesData,
    isBidsLoading,
    userLoading,
    privateSalesLoading,
  ]);

  const hasPlacedBids = notEmptyOrNil(bidsData?.bidsPlaced);
  const hasReceivedBids = notEmptyOrNil(bidsData?.bidsReceived);
  const hasPrivateSalesBuying = notEmptyOrNil(privateSalesBuying);
  const hasPrivateSalesSelling = notEmptyOrNil(privateSalesSelling);

  const hasAnyActivity = isAnyTrue([
    hasPlacedBids,
    hasReceivedBids,
    hasPrivateSalesSelling,
    hasPrivateSalesBuying,
  ]);

  return (
    <Page title="Activity" type={PageType.auth}>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Body>
          <Box css={{ maxWidth: 1280, width: '100%', marginX: 'auto' }}>
            <PageHeading size={{ '@initial': 4, '@bp1': 5 }}>
              Activity
            </PageHeading>

            {!hasAnyActivity ? (
              <BidsEmptyState />
            ) : (
              <>
                <SectionHeading size={{ '@initial': 3, '@bp1': 4 }}>
                  Auctions
                </SectionHeading>
                <Box css={{ '@bp0': { marginBottom: '$7' } }}>
                  <TabsWithLabels<Tab, string>
                    tabs={[
                      {
                        label: (
                          <ProfileCollectionTabLabel
                            label="Bids Placed"
                            count={length(bidsData?.bidsPlaced)}
                            showCount={true}
                          />
                        ),
                        value: BidTab.BidsPlaced,
                      },
                      {
                        label: (
                          <ProfileCollectionTabLabel
                            label="Bids Received"
                            count={length(bidsData?.bidsReceived)}
                            showCount={true}
                          />
                        ),
                        value: BidTab.BidsReceived,
                      },
                    ]}
                    setCurrentView={setCurrentTab}
                    currentView={currentTab}
                  />
                </Box>

                {currentTab === BidTab.BidsPlaced && (
                  <PrimaryBidsTable bids={bidsData?.bidsPlaced} />
                )}

                {currentTab === BidTab.BidsReceived && (
                  <SecondaryBidsTable bids={bidsData?.bidsReceived} />
                )}

                <SectionHeading size={{ '@initial': 3, '@bp1': 4 }}>
                  Private Sales
                </SectionHeading>
                <Box css={{ '@bp0': { marginBottom: '$7' } }}>
                  <TabsWithLabels<Tab, string>
                    tabs={[
                      {
                        label: (
                          <ProfileCollectionTabLabel
                            label="Sent"
                            count={length(privateSalesSelling)}
                            showCount={true}
                          />
                        ),
                        value: PrivateSalesTab.Sent,
                      },
                      {
                        label: (
                          <ProfileCollectionTabLabel
                            label="Received"
                            count={length(privateSalesBuying)}
                            showCount={true}
                          />
                        ),
                        value: PrivateSalesTab.Received,
                      },
                    ]}
                    setCurrentView={setCurrentTabSales}
                    currentView={currentTabSales}
                  />
                </Box>

                {currentTabSales === PrivateSalesTab.Received && (
                  <PrivateSalesTable
                    privateSales={privateSalesBuying}
                    type="received"
                  />
                )}

                {currentTabSales === PrivateSalesTab.Sent && (
                  <PrivateSalesTable
                    privateSales={privateSalesSelling}
                    type="sent"
                  />
                )}
              </>
            )}
          </Box>
        </Body>
      )}
    </Page>
  );
}
