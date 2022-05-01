import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import PrivateSaleSubmittedContainer from 'components/transactions/privateSale/PrivateSaleSubmittedContainer';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import { isAnyTrue } from 'utils/helpers';
import { PageType } from 'types/page';

PrivateSaleSubmitted.getLayout = TransactionLayoutV2({
  title: 'Send Private Sale',
  backgroundColor: '$black5',
  pageType: PageType.minimalLoggedIn,
});

export default function PrivateSaleSubmitted(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();

  const isLoading = isAnyTrue([isUserLoading]);

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  return <PrivateSaleSubmittedContainer />;
}
