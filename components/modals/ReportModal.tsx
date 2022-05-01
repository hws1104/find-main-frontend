import { Formik, Form } from 'formik';
import { useState } from 'react';
import { useLocation } from 'react-use';
import NextLink from 'next/link';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { useMutation } from 'react-query';

import { ModalKey } from 'types/modal';

import Paragraph from 'components/base/Paragraph';

import Button from 'components/base/Button';
import Box from 'components/base/Box';
import TextLink from 'components/base/TextLink';

import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import ModalHeading from './common/ModalHeading';

import SpinnerStroked from 'components/SpinnerStroked';
import TextAreaField from 'components/forms/fields/TextAreaField';
import TextField from 'components/forms/fields/TextField';

import { useUserWithEmailByPublicKey } from 'hooks/queries/use-user-by-public-key';
import useModal from 'hooks/use-modal';

import { sendReport } from 'queries/admin/admin';

import { ReportFormSchema } from 'schemas/admin';

import { ReportType } from 'types/Report';
import { isAllTrue } from 'utils/helpers';

interface ReportModalProps {
  publicAddress: string;
  authToken: string;
  id: string;
  type: ReportType;
}

interface ReportFormProps {
  email?: string;
  id: string;
  type: ReportType;
  onSubmit: () => void;
}

interface SubmittedProps {
  onClose: () => void;
}

function Submitted(props: SubmittedProps) {
  const { onClose } = props;
  return (
    <>
      <ModalHeading css={{ textAlign: 'left', marginX: 0, marginBottom: '$4' }}>
        Report Submitted
      </ModalHeading>
      <Paragraph css={{ paddingRight: '$8', marginBottom: '$6' }}>
        Thank you for submitting a report. Foundation's Trust and Safety team
        will review the report, and reach out to you if they need additional
        information.
      </Paragraph>
      <Button size="large" color="black" shape="regular" onClick={onClose}>
        Close
      </Button>
    </>
  );
}

function ReportForm(props: ReportFormProps) {
  const { email = '', id, type, onSubmit } = props;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { href } = useLocation();
  const {
    mutateAsync: sendReportMutation,
    isLoading: sendReportLoading,
    isSuccess: sendReportSuccess,
  } = useMutation(sendReport, {
    onSettled: () => {
      onSubmit();
    },
  });

  const handleOnSubmit = async (props: {
    email: string;
    description: string;
  }) => {
    try {
      const recaptchaToken = await executeRecaptcha('report_form');
      await sendReportMutation({
        ...props,
        id,
        url: href,
        type,
        recaptchaToken,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <ModalHeading css={{ textAlign: 'left', marginX: 0, marginBottom: '$4' }}>
        Submit a report
      </ModalHeading>
      <Paragraph css={{ prpaddingRight: '$8', mmarginBottom: '$6' }}>
        If you believe there's been a violation of Foundation's{' '}
        <TextLink href="/terms" css={{ display: 'inline' }}>
          Terms of Service
        </TextLink>{' '}
        or{' '}
        <NextLink href="/community-guidelines" passHref>
          <TextLink css={{ display: 'inline' }}>Community Guidelines</TextLink>
        </NextLink>
        , please complete this report.
      </Paragraph>

      <Paragraph css={{ paddingRight: '$8', marginBottom: '$6' }}>
        For all cases related to potential copyright infringement, please email{' '}
        <TextLink
          href="mailto:trust@foundation.app"
          css={{ display: 'inline' }}
        >
          trust@foundation.app
        </TextLink>{' '}
        directly with a formal DMCA Takedown Request.
      </Paragraph>

      <Formik
        initialValues={{
          email: email,
          description: '',
        }}
        enableReinitialize
        validationSchema={ReportFormSchema}
        onSubmit={handleOnSubmit}
      >
        <Form>
          <Box css={{ marginBottom: '$5' }}>
            <TextField
              name="email"
              placeholder="Email address"
              label="Email address"
            />
          </Box>

          <Box css={{ marginBottom: '$5' }}>
            <TextAreaField
              name="description"
              placeholder="Describe why you think this page should be removed from Foundation."
              label="Description"
              rows={6}
            />
          </Box>

          <Button
            type="submit"
            size="large"
            color="black"
            shape="regular"
            css={{ width: '100%' }}
            disabled={sendReportLoading || sendReportSuccess}
          >
            <Box
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {(sendReportLoading || sendReportSuccess) && (
                <Box css={{ marginRight: '$2', position: 'absolute', left: 0 }}>
                  <SpinnerStroked size={18} />
                </Box>
              )}{' '}
              Submit
            </Box>
          </Button>
        </Form>
      </Formik>
    </>
  );
}

export default function ReportModal(props: ReportModalProps): JSX.Element {
  const { id, type, publicAddress, authToken } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { currentModal, resetModal } = useModal();

  const isOpen = ModalKey.REPORT === currentModal;

  const { data: currentUserAuthData } = useUserWithEmailByPublicKey(
    { publicKey: publicAddress },
    { enabled: isAllTrue([authToken, isOpen]) }
  );

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    resetModal();
  };

  return (
    <ModalContainer modalKey={ModalKey.REPORT}>
      <ModalContent css={{ maxWidth: 500 }}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        >
          {isSubmitted ? (
            <Submitted onClose={handleClose} />
          ) : (
            <ReportForm
              email={currentUserAuthData?.user?.email}
              id={id}
              type={type}
              onSubmit={handleSubmit}
            />
          )}
        </GoogleReCaptchaProvider>
      </ModalContent>
    </ModalContainer>
  );
}
