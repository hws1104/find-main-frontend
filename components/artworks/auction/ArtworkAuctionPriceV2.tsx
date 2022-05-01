import ETHinUSD from 'components/ETHinUSD';
import Box from 'components/base/Box';
import { ActivityMetaPrimary } from 'components/activity/ActivityMetaPrimary';

import { formatETHWithSuffix } from 'utils/formatters';

interface ArtworkAuctionPriceProps {
  label: string;
  amountInETH: number;
  className?: string;
}

export default function ArtworkAuctionPriceV2(
  props: ArtworkAuctionPriceProps
): JSX.Element {
  const { label, amountInETH, className } = props;
  return (
    <Box className={className}>
      <ActivityMetaPrimary
        title={label}
        value={formatETHWithSuffix(Number(amountInETH))}
        label={<ETHinUSD amount={amountInETH?.toString()} />}
      />
    </Box>
  );
}
