import Link from 'next/link';
import { format } from 'date-fns';
import { getAllWork } from '@/lib/server/work-mdx';
import SectionHeader from '@/components/common/section-header';

export default function WorkListPage() {
    const workExperiences = getAllWork();

    return (
        <div className="flex-1 max-w-4xl mx-auto bg-background text-foreground px-4 py-16">
            <SectionHeader
                title="work"
                primaryText="the path"
                secondaryText="to the person i want to be"
            />

            <div className="space-y-6">
                {workExperiences.map((work) => {
                    // Format date range
                    let dateRange = '';
                    try {
                        if (work.startDate) {
                            const startDate = new Date(work.startDate);
                            const startFormatted = !isNaN(startDate.getTime())
                                ? format(startDate, 'MMM yyyy')
                                : work.startDate;

                            const endDate = work.endDate
                                ? new Date(work.endDate)
                                : null;

                            const endFormatted = endDate && !isNaN(endDate.getTime())
                                ? format(endDate, 'MMM yyyy')
                                : work.endDate || 'Present';

                            dateRange = `${startFormatted} — ${endFormatted}`;
                        }
                    } catch (error) {
                        console.error("Error formatting date range:", error);
                        dateRange = `${work.startDate || ''} — ${work.endDate || 'Present'}`;
                    }

                    return (
                        <div key={work.slug} className="border-b border-border pb-6">
                            <Link prefetch href={`/work/${work.slug}`} className="flex justify-between items-center w-full group">
                                <span className="text-base md:text-lg group-hover:text-primary transition-colors">
                                    {work.company.toLowerCase()}
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