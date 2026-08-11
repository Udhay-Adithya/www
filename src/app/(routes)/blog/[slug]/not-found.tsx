import ArticleHeader from '@/components/common/article-header';

export default function NotFound() {
    return (
        <main className="flex-1 container-wide py-16">
            <ArticleHeader
                backHref="/blog"
                backLabel="blogs"
                title="nothing here"
            />
            <div className="article-column mt-24 text-muted-foreground">
                the post you&rsquo;re looking for doesn&rsquo;t exist or was moved.
            </div>
        </main>
    );
}
