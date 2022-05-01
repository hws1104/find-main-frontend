import HomePageButton from 'components/buttons/HomePageButton';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import Grid from 'components/base/Grid';
import Box from 'components/base/Box';

import { ArticleGrid } from 'components/Articles';

interface FeaturedArticlesProps {
  articles: any[];
}

export default function FeaturedArticles(
  props: FeaturedArticlesProps
): JSX.Element {
  const { articles } = props;
  return (
    <Box>
      <FeaturedSectionHeading
        link={{ href: '/blog', text: 'View all articles' }}
      >
        Blog
      </FeaturedSectionHeading>
      <Grid css={{ gap: '$7' }}>
        <ArticleGrid articles={articles} />
        <HomePageButton href="/blog">View all articles</HomePageButton>
      </Grid>
    </Box>
  );
}
