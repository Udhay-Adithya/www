import type { CSSProperties } from 'react';
import BackLink from './back-link';

/**
 * Keeps the ghost title roughly the width of the header block whatever its
 * length: a one-word company name gets the full display size, a sentence-long
 * post title scales down rather than running off the page.
 *
 * Petemoss sets at roughly 0.2em per character, so filling ~460px of the
 * header works out at ~140/length rem, bounded either side.
 */
function ghostSize(title: string) {
    return Math.min(10, Math.max(3, 140 / title.length));
}

type ArticleHeaderProps = {
    backHref: string;
    backLabel: string;
    /** Rendered above the title — a date, or a date range */
    meta?: string;
    title: string;
    /** Rendered below the title — a role, a company, a one-line summary */
    subtitle?: string;
};

export default function ArticleHeader({
    backHref,
    backLabel,
    meta,
    title,
    subtitle,
}: ArticleHeaderProps) {
    return (
        <header className="lg:flex lg:items-start">
            <div className="lg:flex-1">
                <BackLink href={backHref} label={backLabel} />
            </div>

            <div className="mt-10 lg:mt-0 lg:w-[35rem] lg:text-center">
                {meta && <span className="text-sm text-muted-foreground">{meta}</span>}

                <div className="relative">
                    <h1 className="mt-4 lg:my-2 text-base font-normal">{title}</h1>
                    <span
                        className="abstract-title"
                        style={{ '--ghost-size': `${ghostSize(title)}rem` } as CSSProperties}
                        aria-hidden
                    >
                        {title}
                    </span>
                </div>

                {subtitle && (
                    <span className="block text-sm text-muted-foreground">{subtitle}</span>
                )}
            </div>

            {/* Balances the back link so the middle column sits centred */}
            <div className="hidden lg:block lg:flex-1" />
        </header>
    );
}
