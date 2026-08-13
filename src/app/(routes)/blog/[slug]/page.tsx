// src/app/(routes)/blog/[slug]/page.tsx
import { getBlogBySlug } from '@/lib/server/mdx';
import { getAllBlogs } from '@/lib/server/content-index';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import CoverImage from '@/components/common/cover-image';
import TableOfContents from '@/components/blog/table-of-contents';
import ArticleHeader from '@/components/common/article-header';
import { extractHeadings } from '@/lib/server/headings';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function BlogPage({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    let formattedDate = blog.frontmatter.date;
    try {
        const dateObject = new Date(blog.frontmatter.date);
        if (!isNaN(dateObject.getTime())) {
            formattedDate = format(dateObject, 'MMMM d, yyyy');
        }
    } catch (error) {
        console.error("Error formatting date:", error);
    }

    // Calculate reading time (rough estimate)
    const wordsPerMinute = 200;
    const contentText = (blog.rawContent || '').replace(/<[^>]*>/g, '');
    const wordCount = contentText ? contentText.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    const title = blog.frontmatter.title.toLowerCase();
    const headings = extractHeadings(blog.rawContent ?? '');

    return (
        <main className="flex-1 container-wide py-16">
            <ArticleHeader
                backHref="/blog"
                backLabel="blogs"
                meta={formattedDate}
                title={title}
                subtitle={`${readingTime} min read`}
            />

            <article className="article-column mt-24">
                {blog.frontmatter.image && (
                    <CoverImage src={blog.frontmatter.image} alt={blog.frontmatter.title} />
                )}

                <TableOfContents headings={headings} />

                <div className="blog-content" id="blog-content">
                    {blog.content}
                </div>

                {blog.frontmatter.tags && blog.frontmatter.tags.length > 0 && (
                    <footer className="mt-20 flex flex-wrap gap-2">
                        {blog.frontmatter.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground"
                            >
                                {tag.toLowerCase()}
                            </span>
                        ))}
                    </footer>
                )}
            </article>
        </main>
    );
}

// Pre-generate all blog pages at build time for instant navigations
export function generateStaticParams() {
    return getAllBlogs().map(({ slug }) => ({ slug }));
}

// Treat unknown slugs as 404 and avoid per-request rendering
export const dynamicParams = false;
