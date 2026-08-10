import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { getAllWork, getWorkBySlug } from '@/lib/server/work-mdx';

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

            dateRange = `${startFormatted} - ${endFormatted}`;
        }
    } catch (error) {
        console.error("Error formatting date range:", error);
        dateRange = `${work.frontmatter.startDate || ''} - ${work.frontmatter.endDate || 'Present'}`;
    }

    return (
        <div className="flex-1 bg-background py-12 px-4">
            <article className="prose prose-lg dark:prose-invert max-w-2xl mx-auto">
                {/* Company logo/image - if available */}
                {work.frontmatter.image && (
                    <div className="mb-8 flex justify-center">
                        <div className="relative h-16 w-16 overflow-hidden">
                            <Image
                                src={work.frontmatter.image}
                                alt={work.frontmatter.company}
                                width={64}
                                height={64}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Work header */}
                <div className="mb-10 border-b border-border pb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{work.frontmatter.role}</h1>
                    <h2 className="text-xl md:text-2xl text-muted-foreground mb-4">{work.frontmatter.company}</h2>

                    <div className="items-center justify-center text-sm text-muted-foreground">
                        <time>{dateRange}</time>
                        {work.frontmatter.location && (
                            <>
                                <span className="mx-2">·</span>
                                <span>{work.frontmatter.location}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Tech stack/skills section - if available */}
                {work.frontmatter.skills && work.frontmatter.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {work.frontmatter.skills.map((skill: string) => (
                            <span key={skill} className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* Work description */}
                <div className="blog-content leading-relaxed">
                    {work.frontmatter.description}
                </div>

                {/* Work content */}
                <div className="blog-content leading-relaxed">
                    {work.content}
                </div>


            </article>
        </div>
    );
}

// SSG for work pages
export function generateStaticParams() {
    return getAllWork().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;