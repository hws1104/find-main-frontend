import { Formik, Form } from 'formik';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Button from 'components/base/Button';

import { setInvites } from 'queries/admin/admin';

import ModalHeading from '../common/ModalHeading';

import SpinnerStroked from 'components/SpinnerStroked';
import NumberField from 'components/forms/fields/NumberField';

import { SetInvitesSchema } from 'schemas/admin';
import { useUserInviteCount } from 'graphql/hasura/queries/user-invite-count.generated';

import Paragraph from 'components/base/Paragraph';

interface GiveInvitesPaneProps {
  publicKey: string;
  token: string;
}

const validationSchema = SetInvitesSchema;

export default function GiveInvitesPane(
  props: GiveInvitesPaneProps
): JSX.Element {
  const { publicKey, token } = props;

  const router = useRouter();

  const { data: userInviteData } = useUserInviteCount(
    { publicKey },
    { enabled: Boolean(publicKey) }
  );

  const {
    mutate: setInvitesMutation,
    isLoading: setInvitesLoading,
    isSuccess: setInvitesSuccess,
  } = useMutation(setInvites, {
    onSuccess: () => {
      router.reload();
    },
  });

  const totalInviteCount = userInviteData?.inviteCount?.aggregate?.count ?? 0;
  const remainingInviteCount =
    userInviteData?.inviteRemainingCount?.aggregate?.count ?? 0;

  const handleSubmit = (data) => {
    setInvitesMutation({
      publicAddress: publicKey,
      count: data.newInvites,
      token,
    });
  };

  return (
    <Box css={{ padding: '$6' }}>
      <ModalHeading css={{ marginX: 0, marginBottom: '$4', textAlign: 'left' }}>
        Give Invites
      </ModalHeading>

      <Paragraph css={{ marginBottom: '$4' }}>
        Enter number of new invites to give
      </Paragraph>

      <Formik
        initialValues={{ newInvites: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(props) => {
          const newInviteCount = props.values.newInvites || 0;

          return (
            <Form>
              <Box css={{ marginBottom: '$6' }}>
                <NumberField name="newInvites" placeholder="0" />
              </Box>

              <Box css={{ display: 'flex', marginBottom: '$6' }}>
                <Box
                  css={{
                    borderRight: '1px solid $black5',
                    paddingRight: '$6',
                  }}
                >
                  <Paragraph>Current Invites</Paragraph>
                  <Text size={4} weight={600}>
                    {remainingInviteCount}
                  </Text>
                  <Paragraph>
                    available
                    <br /> out of {totalInviteCount ?? '-'} total
                  </Paragraph>
                </Box>

                <Box
                  css={{
                    paddingLeft: '$6',
                  }}
                >
                  <Paragraph>New Invites</Paragraph>
                  <Text weight={600} size={4}>
                    {remainingInviteCount + newInviteCount}
                  </Text>
                  <Paragraph>
                    available
                    <br /> out of {totalInviteCount + newInviteCount ??
                      '-'}{' '}
                    total
                  </Paragraph>
                </Box>
              </Box>
              <Button
                type="submit"
                size="large"
                color="black"
                shape="regular"
                css={{ width: '100%' }}
                disabled={setInvitesLoading || setInvitesSuccess}
              >
                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {(setInvitesLoading || setInvitesSuccess) && (
                    <Box
                      css={{
                        margingRight: '$2',
                        position: 'absolute',
                        left: 0,
                      }}
                    >
                      <SpinnerStroked size={18} />
                    </Box>
                  )}{' '}
                  Save
                </Box>
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
