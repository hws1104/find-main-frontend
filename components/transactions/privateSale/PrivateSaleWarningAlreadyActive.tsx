import WarningBlock from 'components/trust-safety/WarningBlock';
import { ModerationStatus } from 'types/Moderation';

export default function PrivateSaleWarningAlreadyActive(): JSX.Element {
  return (
    <WarningBlock
      icon={ModerationStatus.UnderReview}
      title="You already have an active private sale"
      description="You already have an active private sale for this NFT, go to your Activity page to view it"
    />
  );
}
