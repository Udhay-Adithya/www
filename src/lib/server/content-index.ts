import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogMeta, ProjectMeta, WorkMeta } from '@/types';

/**
 * Frontmatter-only listings.
 *
 * Deliberately kept apart from the by-slug loaders: those pull in the mdx
 * compiler and the client components it renders with, and an index page that
 * only needs titles and dates should not carry any of that.
 */

const BLOG_PATH = path.join(process.cwd(), 'src/content/blog');
const WORK_PATH = path.join(process.cwd(), 'src/content/work');
const PROJECTS_PATH = path.join(process.cwd(), 'src/content/projects');

function readMeta<T>(dir: string, slugOf: (file: string, data: T) => string): T[] {
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
            return { ...(data as T), slug: slugOf(file, data as T) };
        });
}

function byDateDesc(a?: string, b?: string) {
    return new Date(b || '').getTime() - new Date(a || '').getTime();
}

export function getAllBlogs(): BlogMeta[] {
    return readMeta<BlogMeta>(BLOG_PATH, (file, data) =>
        // Use ID if available, otherwise fallback to filename
        data.id || file.replace(/\.mdx$/, '')
    ).sort((a, b) => byDateDesc(a.date, b.date));
}

export function getAllWork(): WorkMeta[] {
    return readMeta<WorkMeta>(WORK_PATH, (file) => file.replace(/\.mdx$/, '')).sort(
        (a, b) => byDateDesc(a.startDate, b.startDate)
    );
}

export function getAllProjects(): ProjectMeta[] {
    return readMeta<ProjectMeta>(PROJECTS_PATH, (file) => file.replace(/\.mdx$/, '')).sort(
        (a, b) => byDateDesc(a.startDate, b.startDate)
    );
}
