import { CSS } from 'stitches.config';

import Flex from 'components/base/Flex';

import SpinnerStroked from './SpinnerStroked';

interface LoadingPageProps {
  css?: CSS;
}

export default function LoadingPage(props: LoadingPageProps): JSX.Element {
  const { css } = props;
  return (
    <Flex
      css={{
        flex: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '$10',
        ...(css as any),
      }}
    >
      <SpinnerStroked size={44} />
    </Flex>
  );
}
