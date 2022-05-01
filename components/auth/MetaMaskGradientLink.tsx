import AuthConnectButton from './AuthConnectButton';
import Icon from 'components/Icon';
import MetaMaskIcon from 'assets/icons/metamask-icon.svg';

interface MetaMaskGradientLinkProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function MetaMaskGradientLink(
  props: MetaMaskGradientLinkProps
): JSX.Element {
  const { onClick, isLoading } = props;
  return (
    <AuthConnectButton
      onClick={onClick}
      isLoading={isLoading}
      backgroundImage="linear-gradient(267.54deg, rgb(255, 220, 36) 1.63%, rgb(255, 92, 0) 98.05%)"
    >
      MetaMask <Icon icon={MetaMaskIcon} width={30} height={28} />
    </AuthConnectButton>
  );
}
