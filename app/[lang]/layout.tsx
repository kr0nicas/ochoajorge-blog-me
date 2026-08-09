import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/utils";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["500", "700"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-archivo",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "feed.xml", title: "Jorge Ochoa — RSS Feed" }],
    },
  },
  // AI/LLM-specific meta tags
  other: {
    "ai-agent": "allowed",
    "llms.txt": "/llms.txt",
    "x-ai-content": "technical-blog",
    "content-type": "technical-architecture",
  },
};

export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    image: siteConfig.ogImage,
    sameAs: [
      siteConfig.author.linkedin,
      siteConfig.author.github,
      `https://x.com/${siteConfig.author.twitter.replace("@", "")}`,
      siteConfig.author.bluesky,
    ],
    jobTitle: "Specialist Technology Architect",
    worksFor: {
      "@type": "Organization",
      name: "Equifax LATAM",
      url: "https://www.equifax.com"
    },
    knowsAbout: [
      "Google Cloud Platform",
      "Kubernetes",
      "Docker",
      "Clean Architecture",
      "Hexagonal Architecture",
      "AI Agents",
      "Multi-Agent Systems",
      "Go Programming",
      "Python",
      "Domain-Driven Design",
      "DevOps"
    ],
    description: "Specialist Technology Architect at Equifax LATAM with 10+ years of experience. Expert in cloud architecture, distributed systems, and AI agent integration."
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jorge Ochoa - Technical Blog",
    url: siteConfig.url,
    logo: siteConfig.ogImage,
    description: "Technical blog about software architecture, AI systems, Clean Architecture patterns, and distributed systems design.",
    founder: {
      "@type": "Person",
      name: siteConfig.author.name
    },
    sameAs: [
      siteConfig.author.linkedin,
      siteConfig.author.github,
      `https://x.com/${siteConfig.author.twitter.replace("@", "")}`
    ]
  };

  return (
      <html lang={lang} suppressHydrationWarning className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {/* JSON-LD Person Schema Global */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* JSON-LD Organization Schema Global */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />

          <div className="relative flex min-h-screen flex-col">
            <Header lang={lang} />
            <main className="flex-1">{children}</main>
            <Footer lang={lang} />
          </div>
          <Analytics />
          <SpeedInsights />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
