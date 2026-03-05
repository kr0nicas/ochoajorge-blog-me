export const dictionaries = {
    es: {
        nav: {
            blog: "Blog",
            projects: "Proyectos",
            about: "Sobre mí",
            uses: "Stack",
            search: "Buscar...",
        },
        hero: {
            title: "Arquitecto de Plataforma & Entusiasta Tech",
            subtitle: "Diseñando soluciones en la nube de alto rendimiento. Escribo sobre Kubernetes, Clean Architecture, Go y la integración de Agentes de IA.",
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
        },
        newsletter: {
            heading: "Aprendamos juntos",
            description: "Artículos sobre arquitectura de software, Python, Next.js e IA aplicada. Sin spam, sin relleno — solo contenido que vale tu tiempo.",
            placeholder: "tu@email.com",
            button: "Suscribirse",
            disclaimer: "Sin spam. Cancela cuando quieras.",
        },
    },
    en: {
        nav: {
            blog: "Blog",
            projects: "Projects",
            about: "About",
            uses: "Uses",
            search: "Search...",
        },
        hero: {
            title: "Technology Architect & Cloud Strategist",
            subtitle: "Designing high-performance cloud solutions. Writing about Kubernetes, Clean Architecture, Go, and applied AI Agents.",
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
        },
        newsletter: {
            heading: "Let's learn together",
            description: "Articles on software architecture, Python, Next.js, and applied AI. No spam, no filler — only content worth your time.",
            placeholder: "you@email.com",
            button: "Subscribe",
            disclaimer: "No spam. Unsubscribe anytime.",
        },
    },
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries.es;
