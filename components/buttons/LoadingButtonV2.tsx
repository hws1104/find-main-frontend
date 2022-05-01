import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

import Button from 'components/base/Button';
import SpinnerStroked from 'components/SpinnerStroked';
import Box from 'components/base/Box';
import ComponentTransition from 'components/ComponentTransition';
import { reject } from 'ramda';
import { isEmptyOrNil } from 'utils/helpers';

type ButtonLabel = {
  default: string;
  loading: string;
};

interface LoadingButtonV2Props {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  label: ButtonLabel;
  onClick?: () => void;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function LoadingButtonV2(props: LoadingButtonV2Props) {
  const { isLoading, isSuccess, isError, label, onClick } = props;

  const displayLabel = isLoading ? label.loading : label.default;

  const optionalProps = {
    onClick,
  };

  return (
    <Button
      type="submit"
      disabled={isError || isLoading}
      color={isSuccess || isLoading ? 'gray' : 'black'}
      size="large"
      shape="regular"
      hoverable
      css={{
        width: '100%',
        cursor: isSuccess ? 'not-allowed' : 'pointer',
        position: 'relative',
        outline: 'none',
      }}
      {...getOptionalProps(optionalProps)}
    >
      {isLoading && (
        <Box
          css={{
            position: 'absolute',
            left: '$5',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <SpinnerStroked size={20} />
        </Box>
      )}
      <AnimatePresence exitBeforeEnter>
        <ComponentTransition key={displayLabel}>
          {displayLabel}
        </ComponentTransition>
      </AnimatePresence>
    </Button>
  );
}

const getOptionalProps: (
  props: Partial<LoadingButtonV2Props>
) => Partial<LoadingButtonV2Props> = (props) => reject(isEmptyOrNil, props);
