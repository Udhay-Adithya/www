import Link from 'next/link';

type ListRowProps = {
    href: string;
    label: string;
    meta: string;
};

export default function ListRow({ href, label, meta }: ListRowProps) {
    return (
        <Link
            prefetch
            href={href}
            className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-0 md:py-5"
        >
            <span className="text-base md:text-lg group-hover:opacity-60 transition-opacity">
                {label}
            </span>
            {/* Leader line filling the gap between the title and its date.
                Dropped once the row stacks, where it would only be a stub. */}
            <hr className="hidden sm:block flex-1 mx-4 border-0 border-t border-border" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
                {meta}
            </span>
        </Link>
    );
}
