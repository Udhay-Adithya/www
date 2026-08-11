import ArticleHeader from '@/components/common/article-header';

export default function NotFound() {
    return (
        <main className="flex-1 container-wide py-16">
            <ArticleHeader
                backHref="/projects"
                backLabel="projects"
                title="nothing here"
            />
            <div className="article-column mt-24 text-muted-foreground">
                the project you&rsquo;re looking for doesn&rsquo;t exist or was moved.
            </div>
        </main>
    );
}
