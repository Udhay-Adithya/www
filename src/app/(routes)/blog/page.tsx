import { getAllBlogs } from '@/lib/server/content-index';
import { format } from 'date-fns';
import SectionHeader from '@/components/common/section-header';
import ListRow from '@/components/common/list-row';

export default function BlogsListPage() {
    const blogs = getAllBlogs();

    return (
        <div className="flex-1 container-wide py-16">
            <div className="md:flex">
                <div className="md:w-1/3 md:pt-56">
                    <SectionHeader
                        title="blogs"
                        primaryText="thoughts"
                        secondaryText="worth sharing"
                    />
                </div>

                <div className="md:flex-1">
                    {blogs
                        .filter((blog) => blog.title) // Only include blogs that have a title
                        .map((blog) => {
                            let formattedDate = blog.date;
                            try {
                                const dateObject = new Date(blog.date);
                                if (!isNaN(dateObject.getTime())) {
                                    formattedDate = format(dateObject, 'MMMM d, yyyy');
                                }
                            } catch (error) {
                                console.error("Error formatting date:", error);
                            }

                            return (
                                <ListRow
                                    key={blog.slug}
                                    href={`/blog/${blog.slug}`}
                                    label={blog.title.toLowerCase()}
                                    meta={formattedDate}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
