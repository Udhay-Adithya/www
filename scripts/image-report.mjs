import fs from 'fs';
import path from 'path';

/**
 * Prints what the images in public/ are costing the repo.
 *
 * Photographs are committed at full size, so this is the thing that makes the
 * repo growing visible instead of gradual. It only ever warns — a heavy image
 * is a judgement call, not a build failure.
 */

const ROOT = path.join(process.cwd(), 'public/images');
const WARN_BYTES = 1_000_000;
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

const mb = (n) => `${(n / 1_000_000).toFixed(1)} MB`;

function walk(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        if (!IMAGE.test(entry.name)) return [];
        return [{ path: path.relative(ROOT, full), bytes: fs.statSync(full).size }];
    });
}

const files = walk(ROOT);
if (files.length === 0) {
    console.log('images: none yet');
    process.exit(0);
}

const total = files.reduce((sum, f) => sum + f.bytes, 0);
const heavy = files.filter((f) => f.bytes > WARN_BYTES).sort((a, b) => b.bytes - a.bytes);

console.log(`images: ${files.length} files, ${mb(total)}`);

if (heavy.length > 0) {
    console.log(
        `\n  ${heavy.length} over ${mb(WARN_BYTES)} — these stay in git history for good:`
    );
    for (const f of heavy.slice(0, 10)) {
        console.log(`    ${mb(f.bytes).padStart(8)}  ${f.path}`);
    }
    if (heavy.length > 10) console.log(`    …and ${heavy.length - 10} more`);
    console.log('  exporting at ~2000px on the long edge would cut these by roughly 10x\n');
}
