import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export type ImageMeta = {
    /** Path as referenced from the browser, e.g. /images/blog/post/cover.jpg */
    src: string;
    width: number;
    height: number;
    /** Bytes on disk, used by the size report */
    bytes: number;
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// One build reads the same cover image from several places (a list page and a
// detail page), and decoding headers repeatedly is wasted work
const cache = new Map<string, ImageMeta | null>();

export function isLocalImage(src: string) {
    return src.startsWith('/') && !src.startsWith('//');
}

/**
 * Reads the real pixel dimensions of an image in public/ at build time.
 *
 * next-mdx-remote compiles mdx at runtime rather than through the bundler, so
 * images cannot be statically imported and never get width and height on their
 * own. Supplying them here is what stops each image from shifting the page as
 * it loads.
 *
 * Returns null when the file is missing or unreadable so a bad path degrades to
 * a plain <img> rather than failing the build.
 */
export async function getImageMeta(src: string): Promise<ImageMeta | null> {
    if (!isLocalImage(src)) return null;
    if (cache.has(src)) return cache.get(src) ?? null;

    const clean = src.split(/[?#]/)[0];
    const file = path.join(PUBLIC_DIR, decodeURIComponent(clean));

    // Refuse anything that escapes public/
    if (!file.startsWith(PUBLIC_DIR)) {
        cache.set(src, null);
        return null;
    }

    let meta: ImageMeta | null = null;
    try {
        const { width, height } = await sharp(file).metadata();
        if (width && height) {
            meta = { src, width, height, bytes: fs.statSync(file).size };
        }
    } catch {
        // Missing or undecodable file
    }

    cache.set(src, meta);
    return meta;
}
