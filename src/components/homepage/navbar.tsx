"use client";

import Link from "next/link";
import { useState } from "react";

// One list, rendered twice — the desktop row and the mobile drawer
const links = [
    { href: "/work", label: "work" },
    { href: "/blog", label: "blog" },
    { href: "/projects", label: "projects" },
    { href: "/pov", label: "pov" },
];

export default function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <nav className="flex shrink-0 justify-between items-center py-6 md:px-4 md:pl-16 md:pr-16 pl-4 pr-8 bg-black text-white relative z-50">
                <div className="text-sm md:text-base">
                    <Link href="/">udhay adithya</Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-4 text-sm md:text-base">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-gray-300 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleDrawer}
                    className="md:hidden flex flex-col justify-center items-center w-4 h-4 space-y-1"
                    aria-label="Toggle navigation menu"
                >
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isDrawerOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isDrawerOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isDrawerOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeDrawer}
                />
            )}

            {/* Mobile Drawer */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col pt-20 px-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="py-4 text-lg border-b border-gray-800 hover:text-gray-300 transition-colors"
                            onClick={closeDrawer}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
