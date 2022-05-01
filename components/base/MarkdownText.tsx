import { CSS } from 'stitches.config';
import ReactMarkdown from 'react-markdown';
import Box from 'components/base/Box';
import Text from './Text';

interface MarkdownTextProps {
  children: string;
  css?: CSS;
}

export default function MarkdownText(props: MarkdownTextProps): JSX.Element {
  const { children, css } = props;

  return (
    <Box>
      <Text
        css={{
          fontSize: '$0',
          lineHeight: '$body',
          wordBreak: 'break-word',
          a: {
            color: 'inherit',
          },
          '& p': {
            marginBottom: '1rem',
          },
          '& p:last-of-type': {
            marginBottom: 0,
          },
          ...(css as any),
        }}
      >
        <ReactMarkdown plugins={[require('remark-breaks')]}>
          {children}
        </ReactMarkdown>
      </Text>
    </Box>
  );
}
