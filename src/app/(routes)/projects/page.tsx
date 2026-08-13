import { format } from 'date-fns';
import { getAllProjects } from '@/lib/server/content-index';
import SectionHeader from '@/components/common/section-header';
import ListRow from '@/components/common/list-row';

export default function ProjectsListPage() {
    const projects = getAllProjects();

    return (
        <div className="flex-1 container-wide py-16">
            <div className="md:flex">
                <div className="md:w-1/3 md:pt-56">
                    <SectionHeader
                        title="projects"
                        primaryText="building"
                        secondaryText="solutions that matter"
                    />
                </div>

                <div className="md:flex-1">
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
                            <ListRow
                                key={project.slug}
                                href={`/projects/${project.slug}`}
                                label={project.title?.toLowerCase() ?? project.slug}
                                meta={dateRange}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
