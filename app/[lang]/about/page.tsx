import Image from "next/image";
import { siteConfig } from "@/lib/utils";
import { ArrowRight, Mail, MapPin, Briefcase, Github, Linkedin, Twitter } from "lucide-react";

export function generateMetadata() {
    return {
        metadataBase: new URL("https://ochoajorge.me"),
        title: "About | Jorge Ochoa",
        description: "Technology Architect at Equifax LATAM, based in El Salvador. Building cloud-native systems on GCP and sharing lessons on architecture, DevOps, and software engineering.",
    };
}

const experience = {
    es: [
        {
            title: "Specialist Technology Architect — LATAM",
            company: "Equifax",
            period: "Mayo 2017 — Presente · 8 años",
            description: "Diseño la transformación de soluciones corporativas hacia Google Cloud Platform a escala internacional. Arquitectura de sistemas de decisión de crédito, Kubernetes, Docker y patrones Hexagonal / Clean Architecture para el bureau de créditos más grande de LATAM.",
        },
        {
            title: "Programador Analista Senior",
            company: "Equifax El Salvador",
            period: "Mayo 2016 — Enero 2018 · 1 año 9 meses",
            description: "Desarrollo Java sobre sistemas de bureau de crédito y plataformas de decisión de crédito. Integración con sistemas heredados y optimización de pipelines de datos.",
        },
        {
            title: "IT Analyst",
            company: "Creativa Consultores S.A.",
            period: "Febrero 2014 — Mayo 2016 · 2 años 4 meses",
            description: "Desarrollo y análisis de sistemas para el bureau de crédito de Equifax El Salvador. Java Developer con Spring, Hibernate, PostgreSQL, Spring MVC, Spring Data y Spring RESTful.",
        },
        {
            title: "Programador Analista",
            company: "Grupo GD",
            period: "Junio 2012 — Febrero 2014 · 1 año 9 meses",
            description: "Desarrollo de aplicaciones según requerimientos de clientes usando Spring, Hibernate, PostgreSQL, Spring MVC y APIs RESTful.",
        },
    ],
    en: [
        {
            title: "Specialist Technology Architect — LATAM",
            company: "Equifax",
            period: "May 2017 — Present · 8 years",
            description: "Designing the transformation of corporate solutions towards Google Cloud Platform at an international scale. Credit decision systems architecture, Kubernetes, Docker, and Hexagonal/Clean Architecture patterns for the largest credit bureau in LATAM.",
        },
        {
            title: "Senior Programmer Analyst",
            company: "Equifax El Salvador",
            period: "May 2016 — Jan 2018 · 1 year 9 months",
            description: "Java development on credit bureau systems and credit decision platforms. Legacy system integration and data pipeline optimization.",
        },
        {
            title: "IT Analyst",
            company: "Creativa Consultores S.A.",
            period: "Feb 2014 — May 2016 · 2 years 4 months",
            description: "Systems analysis and development for Equifax El Salvador's credit bureau. Java Developer using Spring, Hibernate, PostgreSQL, Spring MVC, Spring Data, and Spring RESTful.",
        },
        {
            title: "Programmer Analyst",
            company: "Grupo GD",
            period: "Jun 2012 — Feb 2014 · 1 year 9 months",
            description: "Built client-facing applications using Spring, Hibernate, PostgreSQL, Spring MVC, and RESTful APIs.",
        },
    ]
};

const education = {
    es: [
        {
            degree: "Ingeniería en Sistemas Informáticos",
            school: "Universidad Francisco Gavidia",
            period: "2008 — 2021",
        },
        {
            degree: "Técnico Programador Analista Java",
            school: "ITCA-FEPADE",
            period: "2007 — 2008",
        },
    ],
    en: [
        {
            degree: "Engineer's Degree — Computer Science",
            school: "Universidad Francisco Gavidia",
            period: "2008 — 2021",
        },
        {
            degree: "Java Programmer Analyst Technician",
            school: "ITCA-FEPADE",
            period: "2007 — 2008",
        },
    ],
};

const certifications = [
    "Google Cloud Associate Cloud Engineer",
    "Google Cloud Professional Cloud Architect",
    "Advanced Golang Concepts",
    "Digital Transformation with Google Cloud",
    "Scrum Master Certified (SMC)",
    "Essential Google Cloud Infrastructure: Foundation",
];

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isSpanish = lang === "es";
    const currentExp = lang === "en" ? experience.en : experience.es;
    const currentEdu = lang === "en" ? education.en : education.es;

    return (
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            {/* ── Headline ────────────────────────────────────────── */}
            <div className="mb-20">
                <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                    {isSpanish ? "Arquitecto de Tecnología para" : "Technology Architect for"}{" "}<span className="gradient-text">{isSpanish ? "sistemas a escala" : "systems at scale"}</span>.
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
                    {isSpanish ? (
                        <>
                            Soy Jorge, Arquitecto de Tecnología en{" "}
                            <span className="text-[var(--text-primary)] font-medium">Equifax LATAM</span>,
                            con base en San Salvador, El Salvador. Diseño la transformación de soluciones corporativas hacia
                            Google Cloud Platform y comparto lo que aprendo sobre arquitectura, DevOps y sistemas a escala.
                        </>
                    ) : (
                        <>
                            I&apos;m Jorge, Technology Architect at{" "}
                            <span className="text-[var(--text-primary)] font-medium">Equifax LATAM</span>,
                            based in San Salvador, El Salvador. I design corporate solutions transformation towards Google Cloud Platform
                            and write about architecture, DevOps, and systems at scale.
                        </>
                    )}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <MapPin className="h-4 w-4 text-[var(--brand-light)]" />
                        San Salvador, SV
                    </div>
                    <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <Mail className="h-4 w-4 text-[var(--brand-light)]" />
                        ochoa.j@gmail.com
                    </div>
                </div>
            </div>

            {/* ── Main Bio Section ────────────────────────────────── */}
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
                <div className="lg:col-span-7">
                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6"> {isSpanish ? "Mi Trayectoria" : "My Journey"} </h2>
                    <div className="prose max-w-none text-[var(--text-secondary)] space-y-4">
                        {isSpanish ? (
                            <>
                                <p>
                                    La tecnología me apasiona, pero lo que realmente me mueve son los retos y las personas que los enfrentan juntos.
                                    Soy Technical Solutions Architect en Equifax, donde diseño la transformación de soluciones corporativas
                                    hacia Google Cloud Platform a escala internacional.
                                </p>
                                <p>
                                    Me siento igual de cómodo diseñando una arquitectura compleja que trabajando hombro a hombro con el equipo
                                    para sacarla adelante. Certificado en Google Cloud, con experiencia sólida en Kubernetes, Docker y
                                    patrones como Hexagonal y Clean Architecture.
                                </p>
                                <p>
                                    Creo firmemente en la cultura DevOps, en automatizar todo lo que se pueda automatizar, y en que
                                    la mejor solución siempre nace de un equipo motivado. El reto de hoy: hacer que todo encaje en
                                    la nube — IaaS, SaaS, PaaS — y que además tenga sentido para el negocio.
                                </p>
                                <p>
                                    Esposo, papá de dos hijos hermosos, y eterno apasionado de la tecnología.
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    Technology excites me, but what truly drives me are the challenges and the people who face them together.
                                    I&apos;m a Technical Solutions Architect at Equifax, designing the transformation of corporate solutions
                                    towards Google Cloud Platform at an international scale.
                                </p>
                                <p>
                                    I&apos;m equally comfortable designing complex architectures and working shoulder-to-shoulder with the team to ship them.
                                    Google Cloud certified, with solid experience in Kubernetes, Docker, and patterns like Hexagonal and Clean Architecture.
                                </p>
                                <p>
                                    I firmly believe in DevOps culture, automating everything that can be automated, and that the best
                                    solution always comes from a motivated team. Today&apos;s challenge: making everything fit in the cloud —
                                    IaaS, SaaS, PaaS — in a way that also makes business sense.
                                </p>
                                <p>
                                    Husband, father of two wonderful kids, and lifelong technology enthusiast.
                                </p>
                            </>
                        )}
                    </div>

                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-8 mt-16 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-[var(--brand-light)]" />
                        {isSpanish ? "Experiencia" : "Experience"}
                    </h2>
                    <div className="space-y-12">
                        {currentExp.map((item, i) => (
                            <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-8px)] before:w-px before:bg-[var(--border)]">
                                <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full border border-[var(--brand)] bg-[var(--bg-base)] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.title}</h3>
                                    <span className="text-sm font-medium text-[var(--brand-light)] tabular-nums">{item.period}</span>
                                </div>
                                <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{item.company}</p>
                                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-8 mt-16 flex items-center gap-3">
                        <span className="text-[var(--brand-light)]">🎓</span>
                        {isSpanish ? "Educación" : "Education"}
                    </h2>
                    <div className="space-y-6">
                        {currentEdu.map((item, i) => (
                            <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-8px)] before:w-px before:bg-[var(--border)]">
                                <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full border border-[var(--brand)] bg-[var(--bg-base)] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                    <h3 className="text-base font-bold text-[var(--text-primary)]">{item.degree}</h3>
                                    <span className="text-sm font-medium text-[var(--brand-light)] tabular-nums">{item.period}</span>
                                </div>
                                <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{item.school}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar: Connect ─────────────────────────────── */}
                <aside className="lg:col-span-5">
                    <div className="sticky top-24 space-y-8">
                        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-2xl">
                            <div className="aspect-square relative rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] overflow-hidden flex items-center justify-center">
                                <span className="text-5xl font-display font-bold text-white/20">JO</span>
                                <Image
                                    src="https://6pxof7rpjdk6gkca.public.blob.vercel-storage.com/foto-perfil-blog.webp"
                                    alt="Jorge Ochoa"
                                    fill
                                    className="object-cover mix-blend-overlay opacity-60"
                                    sizes="(max-width: 1024px) 100vw, 400px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-sm font-bold text-white uppercase tracking-widest">Built in SV</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card-glass p-6">
                            <h3 className="font-display font-bold text-[var(--text-primary)] mb-4">{isSpanish ? "Conectar" : "Connect"}</h3>
                            <div className="space-y-3">
                                <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Github className="h-4 w-4" />
                                    GitHub
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                                <a href={siteConfig.author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                                <a href={`https://x.com/${siteConfig.author.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Twitter className="h-4 w-4" />
                                    Twitter
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="card-glass p-6">
                            <h3 className="font-display font-bold text-[var(--text-primary)] mb-4 uppercase text-xs tracking-widest">{isSpanish ? "Arsenal Técnico" : "Technical Arsenal"}</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Go", "Python", "Java", "Spring Boot", "FastAPI", "Next.js", "Docker", "Kubernetes", "Google Cloud", "PostgreSQL", "Solution Architecture", "Clean Architecture", "DevOps"].map(tech => (
                                    <span key={tech} className="rounded-full bg-[var(--border)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border-strong)]/20">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="card-glass p-6">
                            <h3 className="font-display font-bold text-[var(--text-primary)] mb-4 uppercase text-xs tracking-widest">
                                {isSpanish ? "Certificaciones" : "Certifications"}
                            </h3>
                            <ul className="space-y-2">
                                {certifications.map((cert) => (
                                    <li key={cert} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                                        <span className="mt-0.5 shrink-0 text-[var(--brand-light)]">✓</span>
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
