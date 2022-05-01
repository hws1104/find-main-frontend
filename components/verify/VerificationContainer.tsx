import { ReactNode } from 'react';

import Body from 'components/base/Body';

interface VerificationFormContainerProps {
  children: ReactNode;
}

export function VerificationFormContainer(
  props: VerificationFormContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Body
      css={{
        display: 'grid',
        flex: 'auto',
        alignItems: 'center',
        maxWidth: 800,
        paddingBottom: '$7',
      }}
    >
      {children}
    </Body>
  );
}

export function VerificationLaterStateContainer(
  props: VerificationFormContainerProps
): JSX.Element {
  const { children } = props;
  return (
    <Body
      css={{
        display: 'grid',
        flex: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 800,
        paddingBottom: '$7',
      }}
    >
      {children}
    </Body>
  );
}
