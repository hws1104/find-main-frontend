import WarningBlock from 'components/trust-safety/WarningBlock';
import { ModerationStatus } from 'types/Moderation';

export default function PrivateSaleWarningNotOwner(): JSX.Element {
  return (
    <WarningBlock
      icon={ModerationStatus.UnderReview}
      title="This account is not the owner of this NFT"
      description="Check to make sure you are logged in with the correct account"
    />
  );
}
