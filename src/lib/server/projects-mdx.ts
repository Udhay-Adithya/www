// src/lib/server/projects-mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import { ProjectMeta } from '@/types';
import { mdxOptions, mdxComponents } from './mdx-options';
const PROJECTS_PATH = path.join(process.cwd(), 'src/content/projects');


export async function getProjectBySlug(slug: string) {
    const filePath = path.join(PROJECTS_PATH, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<ProjectMeta>({
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
