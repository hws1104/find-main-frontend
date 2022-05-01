/* eslint-disable react/jsx-max-depth */
import { Formik, Form } from 'formik';
import { useCallback } from 'react';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useApproveAsCreator from 'hooks/mutations/use-approve-as-creator';

import Box from 'components/base/Box';
import Body from 'components/base/Body';
import FormContainer from 'components/forms/FormContainer';
import FormHeading from 'components/forms/FormHeading';
import SubmitButton from 'components/forms/SubmitButton';
import TextField from 'components/forms/fields/TextField';
import Page from 'components/Page';

export default function ApproveForm(): JSX.Element {
  const { data: user } = useWalletSession();
  const { mutateAsync: approveAsCreator } = useApproveAsCreator();

  const token = user?.token;
  // TODO: Make sure user is admin. This is guarded on server so mostly a UX improvement.

  const handleSubmit = useCallback(
    async (data) => {
      try {
        await approveAsCreator({ token, data });
      } catch (err) {
        console.log(err);
      }
    },
    [approveAsCreator, token]
  );

  return (
    <Page title="Approve a Creator">
      <Body css={{ position: 'relative', zIndex: 4 }}>
        <FormHeading>Approve a Creator</FormHeading>
        <FormContainer>
          <Formik
            initialValues={{ publicKey: '', email: '' }}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form>
              <Box css={{ paddingTop: '$7' }}>
                <TextField
                  name="publicKey"
                  placeholder="Ethereum Address"
                  label="Ethereum Address"
                />
              </Box>
              <Box css={{ paddingTop: '$7' }}>
                <TextField
                  name="email"
                  placeholder="Email Address"
                  label="Email Address"
                />
              </Box>
              <Box css={{ paddingTop: '$7' }}>
                <SubmitButton submittingText="Approving…" disableIfInvalid>
                  Approve Creator
                </SubmitButton>
              </Box>
            </Form>
          </Formik>
        </FormContainer>
      </Body>
    </Page>
  );
}
