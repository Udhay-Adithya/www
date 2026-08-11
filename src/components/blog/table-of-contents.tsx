'use client';

import { useEffect, useState } from 'react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from the blog content
        const extractHeadings = () => {
            const blogContent = document.getElementById('blog-content');
            if (!blogContent) return;

            const headingElements = blogContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const headingsData: Heading[] = [];

            headingElements.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;
                if (!heading.id) {
                    heading.id = id;
                }

                headingsData.push({
                    id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.charAt(1))
                });
            });

            setHeadings(headingsData);
        };

        // Run after content is rendered
        const timer = setTimeout(extractHeadings, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Intersection Observer to track active heading
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
                threshold: 0
            }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Not worth the space on a short post
    if (headings.length < 3) {
        return null;
    }

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
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={`text-left text-sm transition-colors ${activeId === heading.id
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
