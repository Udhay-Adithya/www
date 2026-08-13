import fs from 'fs';
import path from 'path';
import exifr from 'exifr';
import sharp from 'sharp';

export type Photo = {
    src: string;
    width: number;
    height: number;
    bytes: number;
    /** ISO date the shot was taken, from exif; falls back to file mtime */
    takenAt: string;
    caption?: string;
    /** Tiny inline preview shown while the real file decodes */
    blurDataURL: string;
};

const POV_DIR = path.join(process.cwd(), 'public/images/pov');
const CAPTIONS = path.join(process.cwd(), 'src/content/pov-captions.json');
const EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;

/** Optional { "filename.jpg": "a caption" } — absent is fine */
function readCaptions(): Record<string, string> {
    try {
        return JSON.parse(fs.readFileSync(CAPTIONS, 'utf8'));
    } catch {
        return {};
    }
}

/**
 * Everything in public/images/pov, newest first.
 *
 * Deliberately a directory scan rather than a manifest: dropping a photo in is
 * the whole publishing step. Captions are opt-in through pov-captions.json.
 */
export async function getPhotos(): Promise<Photo[]> {
    if (!fs.existsSync(POV_DIR)) return [];

    const captions = readCaptions();
    const files = fs.readdirSync(POV_DIR).filter((f) => EXTENSIONS.test(f));

    const photos = await Promise.all(
        files.map(async (file): Promise<Photo | null> => {
            const full = path.join(POV_DIR, file);

            try {
                const { width, height } = await sharp(full).metadata();
                if (!width || !height) return null;

                const stat = fs.statSync(full);

                // Only the one tag, so a large raw file isn't parsed in full
                let takenAt = stat.mtime;
                try {
                    const exif = await exifr.parse(full, ['DateTimeOriginal']);
                    if (exif?.DateTimeOriginal instanceof Date) {
                        takenAt = exif.DateTimeOriginal;
                    }
                } catch {
                    // No exif, or a format that carries none
                }

                const blur = await sharp(full)
                    .resize(12, 12, { fit: 'inside' })
                    .webp({ quality: 40 })
                    .toBuffer();

                return {
                    src: `/images/pov/${file}`,
                    width,
                    height,
                    bytes: stat.size,
                    takenAt: takenAt.toISOString(),
                    caption: captions[file],
                    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
                };
            } catch {
                return null;
            }
        })
    );

    return photos
        .filter((p): p is Photo => p !== null)
        .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
}
