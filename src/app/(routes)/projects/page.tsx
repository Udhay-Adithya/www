import Link from 'next/link';
import { format } from 'date-fns';
import { getAllProjects } from '@/lib/server/projects-mdx';
import SectionHeader from '@/components/common/section-header';

export default function ProjectsListPage() {
    const projects = getAllProjects();

    return (
        <div className="flex-1 max-w-4xl mx-auto bg-background text-foreground px-4 py-16">
            <SectionHeader
                title="projects"
                primaryText="building"
                secondaryText="solutions that matter"
            />

            <div className="space-y-6">
                {projects.map((project) => {
                    // Format date range
                    let dateRange = '';
                    try {
                        if (project.startDate) {
                            const startDate = new Date(project.startDate);
                            const startFormatted = !isNaN(startDate.getTime())
                                ? format(startDate, 'MMM yyyy')
                                : project.startDate;

                            const endDate = project.endDate
                                ? new Date(project.endDate)
                                : null;

                            const endFormatted = endDate && !isNaN(endDate.getTime())
                                ? format(endDate, 'MMM yyyy')
                                : project.endDate || 'Present';

                            dateRange = `${startFormatted} — ${endFormatted}`;
                        }
                    } catch (error) {
                        console.error("Error formatting date range:", error);
                        dateRange = `${project.startDate || ''} — ${project.endDate || 'Present'}`;
                    }

                    return (
                        <div key={project.slug} className="border-b border-border pb-6">
                            <Link prefetch href={`/projects/${project.slug}`} className="flex justify-between items-center w-full group">
                                <span className="text-base md:text-lg group-hover:text-primary transition-colors">
                                    {project.title?.toLowerCase()}
                                </span>
                                <span className="text-sm md:text-sm text-muted-foreground">{dateRange}</span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
