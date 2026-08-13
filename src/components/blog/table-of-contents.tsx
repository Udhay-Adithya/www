'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/server/headings';

type TableOfContentsProps = {
    headings: Heading[];
};

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0% -35% 0%',
                threshold: 0,
            }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    // Not worth the space on a short post
    if (headings.length < 3) return null;

    // Indent relative to the shallowest heading in the post rather than to h1,
    // so a post written entirely in h2s doesn't render uniformly indented.
    const baseLevel = Math.min(...headings.map((heading) => heading.level));

    return (
        <nav aria-label="On this page" className="mb-16 border-l border-border pl-5">
            <p className="text-sm text-muted-foreground mb-3">on this page</p>
            <ul className="space-y-1.5">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - baseLevel) * 0.75}rem` }}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={`block text-sm transition-colors ${activeId === heading.id
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
