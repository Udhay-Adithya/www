import Image from 'next/image';

type CoverImageProps = {
    src: string;
    alt: string;
};

/**
 * The image at the top of a post. Framed to a fixed ratio rather than the
 * file's own, so covers line up whatever they were cropped to — and so the
 * space is reserved before the file loads.
 */
export default function CoverImage({ src, alt }: CoverImageProps) {
    return (
        <div className="relative mb-16 aspect-video w-full overflow-hidden rounded-md">
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 768px) 620px, 100vw"
                className="object-cover"
                priority
            />
        </div>
    );
}
