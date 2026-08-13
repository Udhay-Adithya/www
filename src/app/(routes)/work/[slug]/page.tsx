import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { getWorkBySlug } from '@/lib/server/work-mdx';
import { getAllWork } from '@/lib/server/content-index';
import ArticleHeader from '@/components/common/article-header';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function WorkPage({ params }: Props) {
    const { slug } = await params;
    const work = await getWorkBySlug(slug);

    if (!work) {
        notFound();
    }

    // Format date range
    let dateRange = '';
    try {
        if (work.frontmatter.startDate) {
            const startDate = new Date(work.frontmatter.startDate);
            const startFormatted = !isNaN(startDate.getTime())
                ? format(startDate, 'MMM yyyy')
                : work.frontmatter.startDate;

            const endDate = work.frontmatter.endDate
                ? new Date(work.frontmatter.endDate)
                : null;

            const endFormatted = endDate && !isNaN(endDate.getTime())
                ? format(endDate, 'MMM yyyy')
                : work.frontmatter.endDate || 'Present';

            dateRange = `${startFormatted} — ${endFormatted}`;
        }
    } catch (error) {
        console.error("Error formatting date range:", error);
        dateRange = `${work.frontmatter.startDate || ''} — ${work.frontmatter.endDate || 'Present'}`;
    }

    return (
        <main className="flex-1 container-wide py-16">
            <ArticleHeader
                backHref="/work"
                backLabel="work"
                meta={dateRange}
                title={work.frontmatter.company.toLowerCase()}
                subtitle={work.frontmatter.role.toLowerCase()}
            />

            <article className="article-column mt-24">
                {work.frontmatter.image && (
                    <div className="mb-12 flex justify-center">
                        <Image
                            src={work.frontmatter.image}
                            alt={work.frontmatter.company}
                            width={40}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>
                )}

                {/* One .blog-content block so the description and the body share a
                    single vertical rhythm rather than butting up against each other */}
                <div className="blog-content">
                    {work.frontmatter.description && (
                        <p>{work.frontmatter.description}</p>
                    )}
                    {work.content}
                </div>

                {work.frontmatter.skills && work.frontmatter.skills.length > 0 && (
                    <footer className="mt-20 flex flex-wrap gap-2">
                        {work.frontmatter.skills.map((skill: string) => (
                            <span
                                key={skill}
                                className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground"
                            >
                                {skill.toLowerCase()}
                            </span>
                        ))}
                    </footer>
                )}
            </article>
        </main>
    );
}

// SSG for work pages
export function generateStaticParams() {
    return getAllWork().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
