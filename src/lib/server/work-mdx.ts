// src/lib/server/work-mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import { WorkMeta } from '@/types';
import rehypePrettyCode from 'rehype-pretty-code';
import { prettyCodeOptions } from './mdx-options';
import matter from 'gray-matter';

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
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
        },
    });

    return {
        content,
        frontmatter,
        slug,
    };
}

export function getAllWork(): WorkMeta[] {
    // Create directory if it doesn't exist
    if (!fs.existsSync(WORK_PATH)) {
        fs.mkdirSync(WORK_PATH, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(WORK_PATH);

    return files
        .filter(file => file.endsWith('.mdx'))
        .map((file) => {
            const raw = fs.readFileSync(path.join(WORK_PATH, file), 'utf8');
            const { data } = matter(raw);

            return {
                ...(data as WorkMeta),
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