import Text from 'components/base/Text';
import Link from 'components/base/Link';
import Image from 'components/base/Image';

interface PressCardProps {
  title: string;
  href: string;
  imageSrc: string;
  alt: string;
}
export default function PressCard(props: PressCardProps): JSX.Element {
  const { title, href, imageSrc, alt } = props;
  return (
    <Link
      href={href}
      css={{
        color: '$black100',
        textDecoration: 'none',
        textAlign: 'center',
        '@hover': {
          '&:hover': {
            '.box': {
              boxShadow:
                '0px 0px 17px #00FFF0, 0px 7.28341px 14.5668px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      }}
    >
      <Text
        className="box"
        weight={400}
        size={3}
        css={{
          transition: 'box-shadow $1 $ease',
          borderRadius: '$2',
          padding: '$7',
          backgroundColor: '$white100',
          boxShadow: '$0',
        }}
      >
        {title}
      </Text>
      <Image
        css={{ marginTop: '$4', maxHeight: 40, width: 'auto', maxWidth: 200 }}
        src={imageSrc}
        alt={alt}
        loading="lazy"
      />
    </Link>
  );
}
