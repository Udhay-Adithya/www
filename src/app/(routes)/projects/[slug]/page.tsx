import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/server/projects-mdx';
import { getAllProjects } from '@/lib/server/content-index';
import { MoveUpRight } from 'lucide-react';
import ArticleHeader from '@/components/common/article-header';
import CoverImage from '@/components/common/cover-image';

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // Format date range
    let dateRange = '';
    try {
        if (project.frontmatter.startDate) {
            const startDate = new Date(project.frontmatter.startDate);
            const startFormatted = !isNaN(startDate.getTime())
                ? format(startDate, 'MMM yyyy')
                : project.frontmatter.startDate;

            const endDate = project.frontmatter.endDate
                ? new Date(project.frontmatter.endDate)
                : null;

            const endFormatted = endDate && !isNaN(endDate.getTime())
                ? format(endDate, 'MMM yyyy')
                : project.frontmatter.endDate || 'Present';

            dateRange = `${startFormatted} — ${endFormatted}`;
        }
    } catch (error) {
        console.error("Error formatting date range:", error);
        dateRange = `${project.frontmatter.startDate || ''} — ${project.frontmatter.endDate || 'Present'}`;
    }

    return (
        <main className="flex-1 container-wide py-16">
            <ArticleHeader
                backHref="/projects"
                backLabel="projects"
                meta={dateRange}
                title={project.frontmatter.title?.toLowerCase() ?? slug}
                subtitle={project.frontmatter.description}
            />

            <article className="article-column mt-24">
                {project.frontmatter.image && (
                    <CoverImage
                        src={project.frontmatter.image}
                        alt={project.frontmatter.title ?? slug}
                    />
                )}

                <div className="blog-content">
                    {project.content}
                </div>

                <footer className="mt-20 flex flex-wrap items-center gap-2">
                    {project.frontmatter.github && (
                        <Link
                            href={project.frontmatter.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 border border-border rounded-full hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5"
                        >
                            source
                            <MoveUpRight size={12} className="inline-block" />
                        </Link>
                    )}
                    {project.frontmatter.technologies?.map((tech: string) => (
                        <span
                            key={tech}
                            className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground"
                        >
                            {tech.toLowerCase()}
                        </span>
                    ))}
                </footer>
            </article>
        </main>
    );
}

export function generateStaticParams() {
    return getAllProjects().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
