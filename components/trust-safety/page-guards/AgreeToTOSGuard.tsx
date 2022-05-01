/* eslint-disable react/jsx-max-depth */
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';

import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';

import InternalInlineLink from 'components/links/InternalInlineLink';
import LoadingButton from 'components/buttons/LoadingButton';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import { AgreeToTOSSchema } from 'schemas/TOS';

import { setUserOneTimeAction } from 'queries/oneTimeActions';
import {
  UserOneTimeActions,
  useUserOneTimeActions,
} from 'graphql/hasura/queries/user-one-time-actions.generated';

import { ActionType } from 'types/ActionType';
import Paragraph from 'components/base/Paragraph';

interface AgreeToTOSGuardProps {
  token: string;
  publicAddress: string;
}

export default function AgreeToTOSGuard(
  props: AgreeToTOSGuardProps
): JSX.Element {
  const { token, publicAddress } = props;

  const queryClient = useQueryClient();

  const {
    mutateAsync: agreeToTOS,
    isLoading,
    isSuccess,
  } = useMutation(setUserOneTimeAction, {
    onSuccess: (res) => {
      const queryKey = useUserOneTimeActions.getKey({
        publicKey: publicAddress,
        actionType: ActionType['AcceptWelcomeScreen1.0'],
      });
      queryClient.setQueryData<UserOneTimeActions>(queryKey, {
        oneTimeActions: res.recordOneTimeAction,
      });
    },
  });

  const handleSubmit = async () => {
    await agreeToTOS({
      actionType: ActionType['AcceptWelcomeScreen1.0'],
      token,
    });
  };

  return (
    <Flex
      css={{
        maxWidth: 640,
        marginX: 'auto',
        flex: 1,
        alignItems: 'center',
        paddingBottom: '$4',
        paddingX: '$4',
        '@bp1': { paddingX: 0 },
      }}
    >
      <Box>
        <Heading size={5} css={{ textAlign: 'center', marginBottom: '$4' }}>
          Welcome to Foundation!
        </Heading>
        <Grid css={{ gap: '$7', marginBottom: '$6' }}>
          <Paragraph
            css={{ maxWidth: 370, marginX: 'auto', textAlign: 'center' }}
          >
            Before you mint your first NFT, please read through and agree to our
            Community Guidelines.
          </Paragraph>
          <Paragraph
            css={{
              maxWidth: 370,
              marginX: 'auto',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            Here’s a summary…
          </Paragraph>
        </Grid>

        <Box>
          <Formik
            initialValues={{ original: false, kind: false, creative: false }}
            validationSchema={AgreeToTOSSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              const { isValid, dirty } = props;

              return (
                <Form>
                  <Grid css={{ gridRowGap: '$4' }}>
                    <CheckboxAndWrapper
                      name="original"
                      label="Be original"
                      description="Only mint original artworks that you have created. Do
                        not upload anyone else’s copyrighted work, and do not
                        spoof other artists."
                    />
                    <CheckboxAndWrapper
                      name="kind"
                      label="Be kind and inclusive."
                      description="Do not upload anything that’s racist, sexist,
                    homophobic, transphobic, or otherwise harmful to our
                    community."
                    />
                    <CheckboxAndWrapper
                      name="creative"
                      label="Be creative and have fun."
                      description="We are building this new creative economy together, and
                    are excited to see your artistic expression."
                    />
                  </Grid>
                  <Flex
                    css={{
                      justifyContent: 'center',
                      marginY: '$7',
                    }}
                  >
                    <InternalInlineLink
                      href="/community-guidelines"
                      target="_blank"
                    >
                      Read our full Community Guidelines here →
                    </InternalInlineLink>
                  </Flex>

                  <Flex css={{ justifyContent: 'center' }}>
                    <LoadingButton
                      type="submit"
                      disabled={!isValid || !dirty}
                      isLoading={isLoading || isSuccess}
                    >
                      I agree!
                    </LoadingButton>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Flex>
  );
}
