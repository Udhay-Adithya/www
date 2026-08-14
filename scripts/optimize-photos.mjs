import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Shrinks photographs in public/images/pov to something a browser should be
 * asked to download.
 *
 * Rewrites in place, so run it before committing new shots — once a full size
 * original is in a commit, git keeps it whether or not the file shrinks later.
 *
 * Idempotent: a file already within the limits is left alone, so it is safe to
 * run after every upload.
 */

const DIR = path.join(process.cwd(), 'public/images/pov');
const LONG_EDGE = 2000;
const QUALITY = 85;
// Leaves already-optimised files untouched on a re-run
const SKIP_UNDER_BYTES = 900_000;

const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;

const files = fs.existsSync(DIR)
    ? fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f))
    : [];

if (files.length === 0) {
    console.log('no photos to optimize');
    process.exit(0);
}

let before = 0;
let after = 0;
let touched = 0;

for (const file of files) {
    const full = path.join(DIR, file);
    const stat = fs.statSync(full);
    const meta = await sharp(full).metadata();
    const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

    before += stat.size;

    if (longEdge <= LONG_EDGE && stat.size < SKIP_UNDER_BYTES) {
        after += stat.size;
        console.log(`  skip  ${file} (already ${meta.width}x${meta.height}, ${mb(stat.size)})`);
        continue;
    }

    const buffer = await sharp(full)
        // Applies any exif orientation and clears the tag, so the pixels are
        // upright however the camera recorded them
        .rotate()
        .resize({
            width: LONG_EDGE,
            height: LONG_EDGE,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        // Keeps the capture date the pov page sorts on, and the colour profile
        .withMetadata()
        .toBuffer();

    fs.writeFileSync(full, buffer);
    // Preserve the original timestamp: it is the sort fallback for photos
    // that carry no exif date
    fs.utimesSync(full, stat.atime, stat.mtime);

    const now = fs.statSync(full).size;
    after += now;
    touched += 1;

    const out = await sharp(full).metadata();
    console.log(
        `  done  ${file.padEnd(34)} ${meta.width}x${meta.height} ${mb(stat.size)}` +
        `  ->  ${out.width}x${out.height} ${mb(now)}`
    );
}

console.log(
    `\n${touched} of ${files.length} rewritten — ${mb(before)} -> ${mb(after)}` +
    ` (${Math.round((1 - after / before) * 100)}% smaller)`
);
