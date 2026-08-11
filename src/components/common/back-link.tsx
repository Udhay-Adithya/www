import Link from 'next/link';

type BackLinkProps = {
    href: string;
    label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
            <span aria-hidden>&larr;</span>
            <span className="font-petemoss-text text-xl">{label}</span>
        </Link>
    );
}
