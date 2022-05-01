/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useLocation } from 'react-use';
import { useMutation } from 'react-query';
import { Form, Formik, useField } from 'formik';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Paragraph from 'components/base/Paragraph';
import Button from 'components/base/Button';

import ModalHeading from 'components/modals/common/ModalHeading';
import SpinnerStroked from 'components/SpinnerStroked';
import TextField from 'components/forms/fields/TextField';

import EyeIcon from 'assets/icons/eye-icon-bold.svg';
import UnderReviewIcon from 'assets/icons/under-review-icon.svg';
import SuspendedIcon from 'assets/icons/suspended-icon.svg';
import DMCAIcon from 'assets/icons/dmca-icon.svg';

import { ModerationStatus } from 'types/Moderation';

import { SetArtworkModerationProxyProps } from 'queries/admin/artwork';
import { SetProfileModerationProxyProps } from 'queries/admin/profile';
import { SetCollectionModerationProxyProps } from 'queries/admin/collection';
import Icon from 'components/Icon';

type ChangeStatusMutationArgs =
  | SetArtworkModerationProxyProps
  | SetProfileModerationProxyProps
  | SetCollectionModerationProxyProps;

interface ChangeStatusPaneProps {
  moderationStatus: ModerationStatus;
  moderationFrom: string;
  currentUserPublicAddress: string;
  authToken: string;
  entityId: string;
  tokenId?: string;
  dmcaEnabled: boolean;
  mutation: (arg0: ChangeStatusMutationArgs) => Promise<{ done: boolean }>;
}

interface ChangeStatusFormValues {
  moderationStatus: ModerationStatus;
  moderationFrom: string;
  id: string;
}

export default function ChangeStatusPane(
  props: ChangeStatusPaneProps
): JSX.Element {
  const {
    moderationStatus,
    moderationFrom,
    currentUserPublicAddress,
    authToken,
    mutation,
    entityId,
    tokenId,
    dmcaEnabled,
  } = props;

  const router = useRouter();
  const { href } = useLocation();

  const {
    mutateAsync: moderationStatusMutation,
    isLoading: moderationMutationLoading,
    isSuccess: moderationMutationSuccess,
  } = useMutation(mutation, {
    onSuccess: () => {
      router.reload();
    },
  });

  const isLoading = moderationMutationLoading || moderationMutationSuccess;

  const handleSetStatus = async (values: ChangeStatusFormValues) => {
    await moderationStatusMutation({
      ...values,
      tokenId,
      token: authToken,
      adminAddress: currentUserPublicAddress,
      url: href,
    });
  };

  return (
    <Box css={{ padding: 24 }}>
      <Formik<ChangeStatusFormValues>
        initialValues={{
          moderationStatus: moderationStatus,
          moderationFrom: moderationFrom,
          id: entityId,
        }}
        onSubmit={handleSetStatus}
      >
        <Form style={{ display: 'flex', flexDirection: 'column' }}>
          <ModalHeading>Change status</ModalHeading>
          <Box>
            <StatusButton status={ModerationStatus.Active}>
              <>
                <Text
                  weight={600}
                  size={2}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '$2',
                  }}
                >
                  <Box css={{ width: 22, marginRight: '$2' }}>
                    <EyeIcon css={{ display: 'block' }} />
                  </Box>
                  Public
                </Text>
                <Paragraph css={{ color: '$black40' }}>
                  This page will be publicly viewable across Foundation. This is
                  the default state for pages on Foundation.
                </Paragraph>
              </>
            </StatusButton>

            <StatusButton status={ModerationStatus.UnderReview}>
              <>
                <Text
                  weight={600}
                  size={2}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '$2',
                  }}
                >
                  <Box css={{ width: 22, marginRight: '$2' }}>
                    <UnderReviewIcon css={{ display: 'block' }} />
                  </Box>
                  Under Review
                </Text>
                <Paragraph css={{ color: '$black40' }}>
                  This page will be taken down and replaced with an ‘Under
                  Review’ message. It will only be accessible via direct link.
                </Paragraph>
              </>
            </StatusButton>

            {dmcaEnabled && (
              <StatusButton status={ModerationStatus.TakedownRequested}>
                <>
                  <Text
                    weight={600}
                    size={2}
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '$2',
                    }}
                  >
                    <Box css={{ width: 22, marginRight: '$2' }}>
                      <Icon icon={DMCAIcon} width={23} height={27} />
                    </Box>
                    DMCA Complaint
                  </Text>
                  <Grid css={{ gap: '$3' }}>
                    <Paragraph css={{ color: '$black40' }}>
                      This page will be taken down and replaced with a DMCA
                      message. It will only be accessible via direct link.
                    </Paragraph>
                    <TextField
                      name="moderationFrom"
                      label="Complaint submitted by"
                      required={false}
                    />
                  </Grid>
                </>
              </StatusButton>
            )}

            <StatusButton status={ModerationStatus.Suspended}>
              <>
                <Text
                  weight={600}
                  size={2}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '$2',
                  }}
                >
                  <Box css={{ width: 22, marginRight: '$2' }}>
                    <SuspendedIcon css={{ display: 'block' }} />
                  </Box>
                  Removed
                </Text>
                <Paragraph css={{ color: '$black40' }}>
                  This page will be taken down and replaced with a ‘Permanently
                  Removed’ message. It will only be accessible via direct link.
                </Paragraph>
              </>
            </StatusButton>
          </Box>

          <Button
            size="large"
            color="black"
            shape="regular"
            disabled={isLoading}
            type="submit"
          >
            <Box
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {isLoading && (
                <Box css={{ marginRight: '$2', position: 'absolute', left: 0 }}>
                  <SpinnerStroked size={18} />
                </Box>
              )}{' '}
              Save
            </Box>
          </Button>
        </Form>
      </Formik>
    </Box>
  );
}

interface StatusButtonProps {
  children: ReactNode;
  status: ModerationStatus;
}

function StatusButton(props: StatusButtonProps) {
  const { children, status } = props;

  const [field, , helpers] = useField<ModerationStatus>('moderationStatus');

  return (
    <Box
      css={{
        boxShadow: '$2',
        paddingX: '$7',
        paddingY: '$6',
        borderRadius: '$2',
        border: '2px solid $black5',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease-in-out',
        marginBottom: '$6',
        '&:hover': {
          borderColor: '$black30',
        },
        ...(field.value === status && {
          borderColor: '$black100',
          '&:hover': { borderColor: 'currentColor' },
        }),
      }}
      onClick={() => helpers.setValue(status)}
    >
      {children}
    </Box>
  );
}
