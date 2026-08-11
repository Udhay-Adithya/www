export default function Loading() {
    return (
        <div className="flex-1 container-wide py-16 animate-pulse">
            <div className="lg:flex lg:items-start">
                <div className="lg:flex-1">
                    <div className="h-6 w-20 bg-muted rounded" />
                </div>
                <div className="mt-10 lg:mt-0 lg:w-[35rem] flex flex-col lg:items-center gap-3">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-5 w-56 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                </div>
                <div className="hidden lg:block lg:flex-1" />
            </div>
            <div className="article-column mt-24 space-y-3">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-11/12 bg-muted rounded" />
                <div className="h-4 w-10/12 bg-muted rounded" />
                <div className="h-4 w-9/12 bg-muted rounded" />
            </div>
        </div>
    );
}
