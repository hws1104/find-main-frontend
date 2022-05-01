import Box from 'components/base/Box';
import Image from 'components/base/Image';
import {
  HeadingWrapper,
  MarqueeContainer,
  MarqueeWrapper,
} from './ShapesAndMarquee';

interface FooterMarqueeProps {
  backgroundColor: string;
}
export default function FooterMarquee(props: FooterMarqueeProps): JSX.Element {
  const { backgroundColor } = props;
  return (
    <>
      <Box
        css={{
          backgroundColor: backgroundColor,
          position: 'relative',
          height: 148,
          left: 0,
          right: 0,
          boxShadow: 'inset 0px 4px 22px rgba(0, 0, 0, 0.25)',
          display: 'none',
          '@bp1': { display: 'block' },
        }}
      >
        <MarqueeContainer css={{ top: '50%', transform: 'translateY(-50%)' }}>
          <MarqueeWrapper>
            {[...Array(10)].map((_, i) => (
              <HeadingWrapper key={i}>
                <Image
                  src="/images/careers/the-new-creative-economy.png"
                  alt="The new creative economy"
                  css={{
                    maxWidth: 'unset',
                    width: 600,
                    '@bp1': { width: 2000 },
                  }}
                />
              </HeadingWrapper>
            ))}
          </MarqueeWrapper>
        </MarqueeContainer>
      </Box>
      <Box
        css={{
          backgroundColor: backgroundColor,
          paddingY: '$8',
          boxShadow: 'inset 0px 4px 22px rgba(0, 0, 0, 0.25)',
          display: 'block',
          textAlign: 'center',
          '@bp1': { display: 'none' },
        }}
      >
        <Image
          src="/images/careers/the-new-creative-economy-mobile.png"
          alt="The New Creative Economy"
          css={{ maxHeight: 228, margin: 'auto' }}
        />
      </Box>
    </>
  );
}
