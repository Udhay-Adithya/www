// src/lib/server/projects-mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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

export function getAllProjects(): ProjectMeta[] {
    // Create directory if it doesn't exist
    if (!fs.existsSync(PROJECTS_PATH)) {
        fs.mkdirSync(PROJECTS_PATH, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(PROJECTS_PATH);

    return files
        .filter(file => file.endsWith('.mdx'))
        .map((file) => {
            const raw = fs.readFileSync(path.join(PROJECTS_PATH, file), 'utf8');
            const { data } = matter(raw);

            return {
                ...(data as ProjectMeta),
                slug: file.replace(/\.mdx$/, ''),
            };
        })
        .sort((a, b) => {
            // Sort by date (newest startDate first)
            const dateA = new Date(a.startDate || '').getTime();
            const dateB = new Date(b.startDate || '').getTime();
            return dateB - dateA;
        });
}
