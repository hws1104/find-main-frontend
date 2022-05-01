import { ReactNode } from 'react';
import { CSS } from 'stitches.config';
import Heading from 'components/base/Heading';

interface CreatorNameProps {
  children: ReactNode;
  css?: CSS;
}

export default function CreatorName(props: CreatorNameProps): JSX.Element {
  const { children, css } = props;
  return (
    <Heading
      leading="tight"
      size={{ '@initial': 3, '@bp1': 4 }}
      css={{
        marginBottom: '$1',
        overflow: 'hidden',
        wordBreak: 'break-word',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        '@bp1': { textAlign: 'left' },
        ...(css as any),
      }}
    >
      {children}
    </Heading>
  );
}
