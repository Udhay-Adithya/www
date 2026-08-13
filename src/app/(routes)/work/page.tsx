import { format } from 'date-fns';
import { getAllWork } from '@/lib/server/content-index';
import SectionHeader from '@/components/common/section-header';
import ListRow from '@/components/common/list-row';

export default function WorkListPage() {
    const workExperiences = getAllWork();

    return (
        <div className="flex-1 container-wide py-16">
            <div className="md:flex">
                <div className="md:w-1/3 md:pt-56">
                    <SectionHeader
                        title="work"
                        primaryText="the path"
                        secondaryText="to the person i want to be"
                    />
                </div>

                <div className="md:flex-1">
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
                            <ListRow
                                key={work.slug}
                                href={`/work/${work.slug}`}
                                label={work.company.toLowerCase()}
                                meta={dateRange}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
