// src/app/(routes)/blog/[slug]/page.tsx
import { getAllBlogs, getBlogBySlug } from '@/lib/server/mdx';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TableOfContents from '@/components/blog/table-of-contents';

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

    return (
        <div className="flex-1 bg-background">
            {/* Simple navigation */}
            <nav className="border-b border-border/30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <p className="text-muted-foreground">
                            Back to
                            <i>
                                <span className="font-petemoss-text text-xl font-medium mr-2"> blogs</span>
                            </i>
                        </p>
                    </Link>
                </div>
            </nav>

            {/* Main content with TOC */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Table of Contents - Top for mobile, Left for desktop */}
                    <aside className="lg:w-64 lg:sticky lg:top-8 lg:self-start order-first lg:order-none">
                        <TableOfContents />
                    </aside>

                    {/* Main article content */}
                    <main className="flex-1 max-w-3xl">
                        <article>
                            {/* Header */}
                            <header className="mb-12">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
                                    {blog.frontmatter.title}
                                </h1>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                                    <time>{formattedDate}</time>
                                    <span>·</span>
                                    <span>{readingTime} min read</span>
                                </div>

                                {/* Featured image */}
                                {blog.frontmatter.image && (
                                    <div className="mb-12 relative rounded-lg overflow-hidden aspect-video w-full">
                                        <Image
                                            src={blog.frontmatter.image}
                                            alt={blog.frontmatter.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}
                            </header>

                            {/* Content */}
                            <div className="blog-content" id="blog-content">
                                {blog.content}
                            </div>

                            {/* Tags */}
                            {blog.frontmatter.tags && blog.frontmatter.tags.length > 0 && (
                                <footer className="mt-16 pt-8 border-t border-border/30">
                                    <div className="flex flex-wrap gap-2">
                                        {blog.frontmatter.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </footer>
                            )}
                        </article>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Pre-generate all blog pages at build time for instant navigations
export function generateStaticParams() {
    return getAllBlogs().map(({ slug }) => ({ slug }));
}

// Treat unknown slugs as 404 and avoid per-request rendering
export const dynamicParams = false;