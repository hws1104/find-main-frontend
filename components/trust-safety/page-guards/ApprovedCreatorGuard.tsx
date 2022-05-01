import Button from 'components/base/Button';
import {
  ButtonGrid,
  TransactionActionButton,
} from 'components/transactions/generic/TransactionActionButtons';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function ApprovedCreatorGuard() {
  return (
    <TransactionProgressPane
      key="approved-creator"
      status="warning"
      title="You’re not an approved creator"
      description="The wallet that is currently connected is not approved to be a creator on Foundation."
      meta={
        <ButtonGrid>
          <TransactionActionButton href="/" label="Back home" />
          <Button
            as="a"
            hoverable
            size="large"
            shape="regular"
            color="white"
            css={{ width: '100%' }}
            target="_blank"
            rel="noreferrer"
            href="https://help.foundation.app/en/collections/2667653-a-complete-guide-to-becoming-a-creator"
          >
            Learn more
          </Button>
        </ButtonGrid>
      }
    />
  );
}
