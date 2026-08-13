export type BlogMeta = {
    title: string;
    date: string;
    id?: string; // 6-character alphanumeric identifier
    slug?: string;
    description?: string;
    image?: string;
    category?: string;
    tags?: string[];
    author?: string;
};

export interface WorkMeta {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    image?: string;
    skills?: string[];
    slug: string;
}

export interface ProjectMeta {
    title: string;
    description: string;
    image?: string;
    startDate: string;
    endDate?: string;
    technologies: string[];
    github?: string;
    slug: string;
}

