import { Field } from 'formik';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';

import { socialLinks } from 'utils/social-links';
import SocialField from 'components/forms/fields/SocialField';
import { SocialLinkType } from 'types/SocialLink';

export default function UserSocialFields(): JSX.Element {
  return (
    <Box>
      <Heading size={3} css={{ maxWidth: 240, marginBottom: '$7' }}>
        Add links to your social media profiles.
      </Heading>
      <Grid css={{ gap: '$3' }}>
        {socialLinks.map((link) => {
          if (
            link.type === SocialLinkType.twitter ||
            link.type === SocialLinkType.instagram
          ) {
            return null;
          }
          return (
            <Box key={link.type}>
              <Field
                name={`links.${link.type}.platform`}
                value={link.type}
                type="hidden"
              />
              <SocialField {...link} name={`links.${link.type}.handle`} />
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
