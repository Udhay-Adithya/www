import Image from 'next/image';
import { getImageMeta, isLocalImage } from '@/lib/server/image-meta';

type MdxImageProps = {
    src?: string;
    alt?: string;
    /** The bit in quotes: ![alt](/path "caption") */
    title?: string;
};

// The reading column is 620px and code/media break out to 780px past 1100px
const SIZES = '(min-width: 1100px) 780px, (min-width: 768px) 620px, 100vw';

/**
 * Renders markdown images through next/image with real dimensions read off
 * disk, so they reserve their space instead of shifting the article as they
 * load. Falls back to a plain img for remote or unreadable sources.
 */
export default async function MdxImage({ src, alt = '', title }: MdxImageProps) {
    if (!src) return null;

    const meta = isLocalImage(src) ? await getImageMeta(src) : null;

    const image = meta ? (
        <Image
            src={meta.src}
            alt={alt}
            width={meta.width}
            height={meta.height}
            sizes={SIZES}
            className="h-auto w-full"
        />
    ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-auto w-full" />
    );

    if (!title) return image;

    return (
        <figure>
            {image}
            <figcaption>{title}</figcaption>
        </figure>
    );
}
