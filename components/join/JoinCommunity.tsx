import Heading from 'components/base/Heading';
import Grid from 'components/base/Grid';
import Paragraph from 'components/base/Paragraph';
import Button from 'components/base/Button';

interface JoinCommunityProps {
  onClick: () => void;
}

export default function JoinCommunity(props: JoinCommunityProps): JSX.Element {
  const { onClick } = props;

  return (
    <Grid css={{ maxWidth: 720, justifyContent: 'center' }}>
      <Heading size={6} css={{ textAlign: 'center', marginBottom: '$8' }}>
        Join the community
      </Heading>
      <Grid
        css={{
          maxWidth: '36em',
          marginX: 'auto',
        }}
      >
        <Paragraph css={{ textAlign: 'center', marginBottom: '$4' }}>
          Foundation is curated by the community—creators invite other creators
          to join.
        </Paragraph>
        <Paragraph css={{ textAlign: 'center', marginBottom: '$10' }}>
          Get started by creating your profile and sharing more about your work.
        </Paragraph>

        <Button size="large" shape="regular" color="black" onClick={onClick}>
          Set up profile
        </Button>
      </Grid>
    </Grid>
  );
}
