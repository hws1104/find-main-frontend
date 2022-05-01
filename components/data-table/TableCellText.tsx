import Text from 'components/base/Text';
import { CSS } from 'stitches.config';

interface TableCellTextProps {
  value: string;
  css?: CSS;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TableCellText(props: TableCellTextProps) {
  const { value, css } = props;
  return (
    <Text size={{ '@initial': 0, '@bp2': 2 }} weight={600} css={css as any}>
      {value}
    </Text>
  );
}
