import WarningBlock from 'components/trust-safety/WarningBlock';

export default function PrivateSaleWarningInvalid(): JSX.Element {
  return (
    <WarningBlock
      title="Sorry, this link is invalid or has expired."
      description="Only the intended recipient of this proposal is authorized to view this link. Either you are not the intended recipient, or this proposal has passed the 24 hour time limit and is no longer valid."
    />
  );
}
