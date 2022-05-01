import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import NextLink from 'next/link';

import { ButtonGrid } from 'components/transactions/generic/TransactionActionButtons';
import TransactionProgressPane from 'components/transactions/generic/TransactionProgressPane';
import Button, { ButtonVariants } from 'components/base/Button';
import Icon from 'components/Icon';

import TwitterIcon from 'assets/icons/twitter-icon.svg';
import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { CSS } from 'stitches.config';

interface SocialVerificationGuardProps {
  redirectPath?: string;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function SocialVerificationGuard(
  props: SocialVerificationGuardProps
) {
  const { redirectPath } = props;

  const router = useRouter();

  return (
    <TransactionProgressPane
      key="social-verification"
      status="verify"
      title="Please verify your profile."
      description="Verify your profile via at least one social media account to prove the authenticity of your profile on Foundation."
      meta={
        <ButtonGrid>
          <SocialVerificationLink
            label="Verify Twitter"
            redirectPath={redirectPath || router.asPath}
            service="twitter"
          />
          <SocialVerificationLink
            label="Verify Instagram"
            redirectPath={redirectPath || router.asPath}
            service="instagram"
          />
        </ButtonGrid>
      }
    />
  );
}

interface SocialVerificationLinkProps {
  label: string;
  redirectPath: string;
  service: 'twitter' | 'instagram';
}

function SocialVerificationLink(props: SocialVerificationLinkProps) {
  const { label, service, redirectPath } = props;

  return (
    <NextLink
      href={{
        pathname: `/profile/verify/${service}`,
        query: { 'redirect-path': redirectPath },
      }}
      passHref
      prefetch={false}
    >
      <a style={{ display: 'block', textDecoration: 'none' }}>
        <IconButton
          css={{ width: '100%' }}
          label={label}
          icon={
            service === 'twitter' ? (
              <Icon
                icon={TwitterIcon}
                width={20}
                height={20}
                style={{ marginRight: 8, top: 1 }}
              />
            ) : (
              <Icon
                icon={InstagramIcon}
                width={20}
                height={20}
                style={{ marginRight: 8, top: 1 }}
              />
            )
          }
        />
      </a>
    </NextLink>
  );
}

interface IconButtonProps extends ButtonVariants {
  label: string;
  icon: ReactNode;
  css?: CSS;
}

function IconButton(props: IconButtonProps) {
  const {
    label,
    color = 'white',
    size = 'large',
    shape = 'regular',
    icon,
    css,
  } = props;
  return (
    <Button color={color} size={size} shape={shape} css={{ ...(css as any) }}>
      {icon}
      {label}
    </Button>
  );
}
