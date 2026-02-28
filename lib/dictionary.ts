export const dictionaries = {
    es: {
        nav: {
            blog: "Blog",
            projects: "Proyectos",
            about: "Sobre mí",
            search: "Buscar...",
        },
        hero: {
            title: "Arquitecto de Software & Estratega",
            subtitle: "Construyendo sistemas de alto rendimiento y compartiendo lecciones sobre arquitectura, Python e IA.",
        },
        footer: {
            built_with: "Construido con",
            rights: "Todos los derechos reservados",
        },
        blog: {
            read_more: "Leer más",
            reading_time: "min de lectura",
            posted_on: "Publicado el",
            tags: "Etiquetas",
            series: "Serie",
            part: "Parte",
            back: "Volver",
            discussion: "Discusión",
        }
    },
    en: {
        nav: {
            blog: "Blog",
            projects: "Projects",
            about: "About",
            search: "Search...",
        },
        hero: {
            title: "Software Architect & Strategist",
            subtitle: "Building high-performance systems and sharing lessons on architecture, Python, and AI.",
        },
        footer: {
            built_with: "Built with",
            rights: "All rights reserved",
        },
        blog: {
            read_more: "Read more",
            reading_time: "min read",
            posted_on: "Posted on",
            tags: "Tags",
            series: "Series",
            part: "Part",
            back: "Back",
            discussion: "Discussion",
        }
    },
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries.es;
