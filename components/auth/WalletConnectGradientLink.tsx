import Icon from 'components/Icon';
import AuthConnectButton from './AuthConnectButton';

import WalletConnectIcon from 'assets/icons/walletconnect-icon.svg';

interface WalletConnectGradientLinkProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function WalletConnectGradientLink(
  props: WalletConnectGradientLinkProps
): JSX.Element {
  const { onClick, isLoading } = props;
  return (
    <AuthConnectButton
      onClick={onClick}
      isLoading={isLoading}
      backgroundImage="linear-gradient(267.56deg, rgb(5, 0, 255) 0%, rgb(143, 0, 255) 97.07%)"
    >
      WalletConnect <Icon icon={WalletConnectIcon} width={36} height={23} />
    </AuthConnectButton>
  );
}
