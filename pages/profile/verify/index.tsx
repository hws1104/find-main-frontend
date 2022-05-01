import { useRouter } from 'next/router';

import SocialVerificationGuard from 'components/trust-safety/page-guards/SocialVerificationGuard';
import Flex from 'components/base/Flex';
import TransactionLayoutV2 from 'components/layouts/TransactionLayoutV2';

import { getFirstValue } from 'utils/helpers';

VerifySocialBlockPage.getLayout = TransactionLayoutV2({
  title: 'Verify Profile',
  backgroundColor: '$black5',
});

export default function VerifySocialBlockPage(): JSX.Element {
  const router = useRouter();

  const redirectPath = getFirstValue(router.query['redirect-path']);

  return (
    <Flex css={{ flexGrow: 1, alignItems: 'flex-start' }}>
      <Flex css={{ maxWidth: 560, marginX: 'auto' }}>
        <SocialVerificationGuard redirectPath={redirectPath} />
      </Flex>
    </Flex>
  );
}
