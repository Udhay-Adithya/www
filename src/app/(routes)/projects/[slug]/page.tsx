import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/lib/server/projects-mdx';
import { Github } from 'lucide-react';

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

            dateRange = `${startFormatted} - ${endFormatted}`;
        }
    } catch (error) {
        console.error("Error formatting date range:", error);
        dateRange = `${project.frontmatter.startDate || ''} - ${project.frontmatter.endDate || 'Present'}`;
    }

    return (
        <div className="flex-1 bg-background py-12 px-4">
            <article className="prose prose-lg dark:prose-invert max-w-2xl mx-auto">
                {/* Project header */}
                <div className="mb-10 border-b border-border pb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{project.frontmatter.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{project.frontmatter.description}</p>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                        <time>{dateRange}</time>
                    </div>

                    {/* Project links */}
                    <div className="flex items-center justify-center gap-4">
                        {project.frontmatter.github && (
                            <Link
                                href={project.frontmatter.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                            >
                                <Github size={16} />
                                Source Code
                            </Link>
                        )}
                    </div>
                </div>

                {/* Technologies section */}
                {project.frontmatter.technologies && project.frontmatter.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.frontmatter.technologies.map((tech: string) => (
                            <span key={tech} className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Project content */}
                <div className="blog-content leading-relaxed">
                    {project.content}
                </div>

            </article>
        </div>
    );
}

export function generateStaticParams() {
    return getAllProjects().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
