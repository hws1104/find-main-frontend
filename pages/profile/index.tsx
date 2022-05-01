/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import { theme } from 'stitches.config';
import { Formik, Form } from 'formik';
import { ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

import useWalletSession from 'hooks/web3/wallet/use-wallet-session';
import useUpsertUser from 'hooks/mutations/use-upsert-user';
import { useUserWithEmailByPublicKey } from 'hooks/queries/use-user-by-public-key';
import { useValidSocialVerificationByService } from 'hooks/queries/hasura/use-social-verification';
import useBodyColor from 'hooks/use-body-color';

import { PageType } from 'types/page';
import { SocialVerifService } from 'types/SocialVerification';

import { mergeSocialLinks, socialLinks } from 'utils/social-links';
import { maybeLowerCase } from 'utils/case';
import { DEFAULT_PROVIDER_TYPE } from 'lib/constants';

import { createUserSchema } from 'schemas/user';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import UserFormFields from 'components/forms/onboarding/UserFormFields';
import FormContainer from 'components/forms/FormContainer';
import FormHeading from 'components/forms/FormHeading';
import FormGrid from 'components/forms/FormGrid';
import Page from 'components/Page';
import Body from 'components/base/Body';
import SubmitButton from 'components/forms/SubmitButton';
import LoadingPage from 'components/LoadingPage';

export default function Profile(): JSX.Element {
  const { data: user, isLoading: isUserLoading } = useWalletSession();
  useBodyColor(theme.colors.black5.value);

  const { data, isLoading: isUserWithEmailLoading } =
    useUserWithEmailByPublicKey({ publicKey: user?.publicAddress });

  const router = useRouter();

  const { data: twitterSocialVerification } =
    useValidSocialVerificationByService({
      publicKey: user?.publicAddress,
      service: SocialVerifService.TWITTER,
    });

  const { data: instagramSocialVerification } =
    useValidSocialVerificationByService({
      publicKey: user?.publicAddress,
      service: SocialVerifService.INSTAGRAM,
    });

  const userData = data?.user;

  const publicAddress = user?.publicAddress;
  const token = user?.token;
  const username = userData?.username;

  const pageCopy = {
    title: 'Edit your Profile',
    action: 'Save Changes',
    submittingText: 'Saving Changes…',
  };

  const { mutateAsync: upsertUser } = useUpsertUser();

  const redirectToProfile = useCallback(
    async (username) => await router.push(`/${maybeLowerCase(username)}`),
    [router]
  );

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await upsertUser({ data: values });
        await redirectToProfile(values.username);
      } catch (err) {
        console.log('Error');
      }
    },
    [upsertUser, redirectToProfile]
  );

  if (isUserLoading || isUserWithEmailLoading || !userData) {
    return (
      <Page title="Profile" type={PageType.auth}>
        <LoadingPage />
      </Page>
    );
  }

  return (
    <PageContainer>
      <FormHeading>{pageCopy.title}</FormHeading>
      <FormGrid>
        <FormContainer>
          <Formik
            initialValues={{
              name: userData?.name ?? '',
              email: userData?.email ?? '',
              providerType: userData?.providerType ?? DEFAULT_PROVIDER_TYPE,
              username: userData?.username ?? '',
              bio: userData?.bio ?? '',
              coverImageUrl: userData?.coverImageUrl ?? '',
              profileImageUrl: userData?.profileImageUrl ?? '',
              links: mergeSocialLinks(socialLinks, userData?.links),
            }}
            validationSchema={createUserSchema({ currentUsername: username })}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid
                css={{
                  gap: '$7',
                  '@bp3': {
                    gap: '$9',
                  },
                }}
              >
                <UserFormFields
                  token={token}
                  twitterSocialVerification={twitterSocialVerification}
                  instagramSocialVerification={instagramSocialVerification}
                  publicAddress={publicAddress}
                />
              </Grid>
              <Box css={{ paddingTop: '$7' }}>
                <SubmitButton
                  submittingText={pageCopy.submittingText}
                  disableIfInvalid
                >
                  {pageCopy.action}
                </SubmitButton>
              </Box>
            </Form>
          </Formik>
        </FormContainer>
      </FormGrid>
    </PageContainer>
  );
}

interface PageContainerProps {
  children: ReactNode | ReactNode[];
}

function PageContainer({ children }: PageContainerProps): JSX.Element {
  return (
    <>
      <Page title="Profile" type={PageType.auth}>
        <Body>{children}</Body>
      </Page>
    </>
  );
}
