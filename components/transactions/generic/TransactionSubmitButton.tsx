import { useFormikContext } from 'formik';
import { useWeb3React } from '@web3-react/core';
import { ReactNode } from 'react';
import { cond, equals } from 'ramda';

import FormikSubmitButton, {
  FormikSubmitButtonProps,
} from 'components/forms/FormikSubmitButton';
import DisabledButton from 'components/forms/transactions/DisabledButton';
import Button from 'components/base/Button';

import { getFormikErrorMessage } from 'utils/formik';

import { ModalKey } from 'types/modal';

import useModal from 'hooks/use-modal';

import getChainId from 'lib/chainId';

type TransactionSubmitButtonProps = FormikSubmitButtonProps;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function TransactionSubmitButton<T>(
  props: TransactionSubmitButtonProps
) {
  const { label, submittedLabel, submittingLabel } = props;

  const { errors } = useFormikContext<T>();

  const { chainId, library } = useWeb3React();

  const { setCurrentModal } = useModal();

  // get the first error message (if it exists)
  const error = getFormikErrorMessage(errors);

  const isCorrectNetwork = chainId === getChainId();

  if (!library) {
    return (
      <ConnectWalletButton
        handleClick={() => setCurrentModal(ModalKey.AUTH_MAIN)}
      >
        Connect wallet to continue
      </ConnectWalletButton>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <DisabledButton>Connect to {getNetworkName(getChainId())}</DisabledButton>
    );
  }

  if (error) {
    return <DisabledButton>{error}</DisabledButton>;
  }

  return (
    <FormikSubmitButton
      label={label}
      submittingLabel={submittingLabel}
      submittedLabel={submittedLabel}
    />
  );
}

interface ConnectWalletButtonProps {
  handleClick: () => void;
  children: ReactNode;
}

function ConnectWalletButton(props: ConnectWalletButtonProps) {
  const { handleClick, children } = props;
  return (
    <Button
      color="black"
      size="large"
      shape="regular"
      type="button"
      css={{ width: '100%' }}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

const getNetworkName = cond<number, string>([
  [equals(1), () => 'Ethereum mainnet'],
  [equals(3), () => 'Ropsten testnet'],
  [equals(4), () => 'Rinkeby testnet'],
  [equals(5), () => 'Goerli testnet'],
]);
