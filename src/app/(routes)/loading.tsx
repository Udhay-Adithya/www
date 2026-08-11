export default function Loading() {
    return (
        <div className="flex-1 container-wide py-16 animate-pulse">
            <div className="md:flex">
                <div className="md:w-1/3 md:pt-56">
                    <div className="h-9 w-40 bg-muted rounded mb-3" />
                    <div className="h-4 w-56 bg-muted rounded" />
                </div>
                <div className="md:flex-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center py-4 md:py-5">
                            <div className="h-5 w-40 bg-muted rounded" />
                            <div className="flex-1 mx-4 border-t border-border" />
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
