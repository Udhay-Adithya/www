'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Photo } from '@/lib/server/pov';

type PhotoGridProps = {
    photos: Photo[];
};

// Grid columns are roughly half the right-hand column on desktop
const GRID_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw';

export default function PhotoGrid({ photos }: PhotoGridProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const open = openIndex === null ? null : photos[openIndex];

    const close = useCallback(() => setOpenIndex(null), []);
    const step = useCallback(
        (delta: number) =>
            setOpenIndex((i) =>
                i === null ? i : (i + delta + photos.length) % photos.length
            ),
        [photos.length]
    );

    useEffect(() => {
        if (openIndex === null) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'ArrowLeft') step(-1);
        };

        document.addEventListener('keydown', onKey);
        // Stop the page behind the overlay from scrolling
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
        };
    }, [openIndex, close, step]);

    if (photos.length === 0) {
        return (
            <p className="text-muted-foreground">
                nothing here yet.
            </p>
        );
    }

    return (
        <>
            {/* css columns keep portrait and landscape shots packed together
                without measuring anything at runtime */}
            <div className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
                {photos.map((photo, index) => (
                    <button
                        key={photo.src}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        aria-label={photo.caption ?? 'view photo'}
                        className="group block w-full break-inside-avoid overflow-hidden"
                    >
                        <Image
                            src={photo.src}
                            alt={photo.caption ?? ''}
                            width={photo.width}
                            height={photo.height}
                            sizes={GRID_SIZES}
                            placeholder="blur"
                            blurDataURL={photo.blurDataURL}
                            className="h-auto w-full transition-opacity duration-300 group-hover:opacity-80"
                        />
                    </button>
                ))}
            </div>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={open.caption ?? 'photo'}
                    onClick={close}
                    className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
                >
                    <Image
                        src={open.src}
                        alt={open.caption ?? ''}
                        width={open.width}
                        height={open.height}
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={open.blurDataURL}
                        className="max-h-[85vh] w-auto max-w-full object-contain"
                        priority
                    />

                    {open.caption && (
                        <p className="mt-4 text-sm text-muted-foreground">{open.caption}</p>
                    )}

                    <button
                        type="button"
                        onClick={close}
                        aria-label="close"
                        className="absolute right-6 top-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        close
                    </button>
                </div>
            )}
        </>
    );
}
