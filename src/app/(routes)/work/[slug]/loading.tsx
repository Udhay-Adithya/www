export default function Loading() {
    return (
        <div className="flex-1 bg-background py-12 px-4 animate-pulse">
            <div className="max-w-2xl mx-auto">
                <div className="h-16 w-16 bg-muted rounded mb-6" />
                <div className="h-10 w-2/3 bg-muted rounded mb-2" />
                <div className="h-6 w-1/2 bg-muted rounded mb-6" />
                <div className="h-4 w-40 bg-muted rounded mb-8" />
                <div className="space-y-3">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-11/12 bg-muted rounded" />
                    <div className="h-4 w-10/12 bg-muted rounded" />
                    <div className="h-4 w-9/12 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}
