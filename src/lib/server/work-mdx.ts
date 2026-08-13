// src/lib/server/work-mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import { WorkMeta } from '@/types';
import { mdxOptions, mdxComponents } from './mdx-options';
const WORK_PATH = path.join(process.cwd(), 'src/content/work');


export async function getWorkBySlug(slug: string) {
    const filePath = path.join(WORK_PATH, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<WorkMeta>({
        source,
        options: mdxOptions,
        components: mdxComponents,
    });

    return {
        content,
        frontmatter,
        slug,
    };
}
