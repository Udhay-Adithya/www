import Image from 'next/image';
import { getImageMeta, isLocalImage } from '@/lib/server/image-meta';

type CoverImageProps = {
    src: string;
    alt: string;
};

// The reading column is 620px, and a cover sits inside it
const SIZES = '(min-width: 768px) 620px, 100vw';

/**
 * The image at the top of a post.
 *
 * Rendered at the file's own ratio, with real dimensions read off disk, so the
 * space is reserved before the file loads and a cover is never cropped to a
 * frame it was not made for. A wide store banner and a square photograph both
 * arrive whole.
 *
 * Falls back to a fixed video-ratio crop when the dimensions cannot be read,
 * which is the only case where there is nothing to reserve space with.
 */
export default async function CoverImage({ src, alt }: CoverImageProps) {
    const meta = isLocalImage(src) ? await getImageMeta(src) : null;

    if (!meta) {
        return (
            <div className="relative mb-16 aspect-video w-full overflow-hidden">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={SIZES}
                    className="object-cover"
                    priority
                />
            </div>
        );
    }

    return (
        <Image
            src={meta.src}
            alt={alt}
            width={meta.width}
            height={meta.height}
            sizes={SIZES}
            className="mb-16 h-auto w-full"
            priority
        />
    );
}
