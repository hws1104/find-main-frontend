import { ReactNode } from 'react';
import { theme } from 'stitches.config';

import useNavigationProgress from 'hooks/use-navigation-progress';
import useTransactionParams from 'hooks/use-transaction-params';
import useArtworkByContractTokenId from 'hooks/queries/hasura/artworks/use-artwork-by-contract-token-id';
import useBodyColor from 'hooks/use-body-color';

import Page from 'components/Page';
import TransactionNavigation from 'components/transactions/TransactionNavigation';
import TransactionContainerV2 from 'components/transactions/TransactionContainerV2';

import { PageType } from 'types/page';
import { CardVariant } from 'types/Card';
import { BasicArtwork } from 'types/Artwork';
import { NavigationStep } from 'types/NavigationStep';

import { notEmptyOrNil } from 'utils/helpers';

type PageTitleBuilder = (arg0: BasicArtwork) => string;

interface TransactionLayoutWithCardProps {
  children: ReactNode;
  title: string;
  buildTitle?: PageTitleBuilder;
  percentCompleted: number;
  navigationSteps: NavigationStep[];
  cardType: CardVariant;
}

export default function TransactionLayoutWithCard(
  props: TransactionLayoutWithCardProps
): JSX.Element {
  const {
    children,
    title,
    buildTitle,
    percentCompleted,
    navigationSteps,
    cardType,
  } = props;

  useBodyColor(theme.colors.black5.value);

  const { tokenId, contractSlug } = useTransactionParams();

  const hasNavigation = notEmptyOrNil(navigationSteps);

  const { data: artworkData } = useArtworkByContractTokenId({
    tokenId: Number(tokenId),
    contractSlug,
  });

  useNavigationProgress({ percentCompleted });

  return (
    <>
      <Page
        type={PageType.auth}
        title={buildTitle ? buildTitle(artworkData) : title}
      >
        {hasNavigation && (
          <TransactionNavigation
            css={{
              paddingTop: '$6',
              '@bp1': {
                paddingTop: '$7',
              },
              '@bp2': {
                paddingTop: '$8',
              },
            }}
            navigationSteps={navigationSteps}
          />
        )}
        <TransactionContainerV2 artwork={artworkData} cardVariant={cardType}>
          {children}
        </TransactionContainerV2>
      </Page>
    </>
  );
}

interface WrappedTransactionLayoutWithCardProps {
  title: string;
  buildTitle?: PageTitleBuilder;
  percentCompleted?: number;
  navigationSteps?: NavigationStep[];
  cardType?: CardVariant;
}

export function WrappedTransactionLayoutWithCard(
  props: WrappedTransactionLayoutWithCardProps
): (arg0: JSX.Element, arg1: TransactionLayoutWithCardProps) => JSX.Element {
  const {
    title,
    buildTitle,
    percentCompleted,
    navigationSteps,
    cardType = CardVariant.default,
  } = props;
  return function RenderWrappedTransactionLayout(
    page: JSX.Element,
    props: TransactionLayoutWithCardProps
  ): JSX.Element {
    return (
      <TransactionLayoutWithCard
        {...props}
        title={title}
        buildTitle={buildTitle}
        percentCompleted={percentCompleted}
        navigationSteps={navigationSteps}
        cardType={cardType}
      >
        {page}
      </TransactionLayoutWithCard>
    );
  };
}
