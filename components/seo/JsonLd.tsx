export interface JsonLdProps {
  schema: Record<string, unknown>;
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Generates BlogPosting JSON-LD schema
 * https://schema.org/BlogPosting
 */
export function BlogPostingJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  tags,
  seriesName,
  seriesPart,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url: string;
    email?: string;
    image?: string;
  };
  image?: string;
  tags?: string[];
  seriesName?: string;
  seriesPart?: number;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
      ...(author.email && { email: author.email }),
      ...(author.image && { image: author.image }),
    },
    publisher: {
      "@type": "Organization",
      name: "Jorge Ochoa",
      url: "https://ochoajorge.me",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    }),
    ...(tags && tags.length > 0 && {
      keywords: tags.join(", "),
    }),
    ...(seriesName && seriesPart && {
      isPartOf: {
        "@type": "CreativeWork",
        name: seriesName,
        position: seriesPart,
      },
    }),
  };

  return <JsonLd schema={schema} />;
}

/**
 * Generates Person JSON-LD schema
 * https://schema.org/Person
 */
export function PersonJsonLd({
  name,
  url,
  jobTitle,
  email,
  image,
  worksFor,
}: {
  name: string;
  url: string;
  jobTitle: string;
  email?: string;
  image?: string;
  worksFor?: {
    name: string;
    url: string;
  };
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    jobTitle,
    ...(email && { email }),
    ...(image && { image }),
    ...(worksFor && {
      worksFor: {
        "@type": "Organization",
        name: worksFor.name,
        url: worksFor.url,
      },
    }),
  };

  return <JsonLd schema={schema} />;
}

/**
 * Generates Organization JSON-LD schema
 * https://schema.org/Organization
 */
export function OrganizationJsonLd({
  name,
  url,
  description,
  logo,
  sameAs,
}: {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(description && { description }),
    ...(logo && { logo }),
    ...(sameAs && { sameAs }),
  };

  return <JsonLd schema={schema} />;
}