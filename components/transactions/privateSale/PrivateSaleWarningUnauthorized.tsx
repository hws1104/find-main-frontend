import WarningBlock from 'components/trust-safety/WarningBlock';

export default function PrivateSaleWarningUnauthorized(): JSX.Element {
  return (
    <WarningBlock
      title="You are not authorized to view this proposal."
      description="Only the intended recipient of this proposal is authorized to view it. If you believe this is incorrect, please ensure you have entered the correct link."
    />
  );
}
