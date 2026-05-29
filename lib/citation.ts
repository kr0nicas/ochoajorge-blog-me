export interface CitationFormats {
  bibtex: string;
  apa: string;
  mla: string;
  json: string;
}

/**
 * Generates citation formats for a blog post
 */
export function generateCitation({
  title,
  author,
  url,
  datePublished,
  lang = "es",
}: {
  title: string;
  author: string;
  url: string;
  datePublished: string;
  lang?: "es" | "en";
}): CitationFormats {
  const date = new Date(datePublished);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // BibTeX format
  const bibtex = `@article{ochoa${year}${title.split(/\s+/)[0].toLowerCase()},
  author = {Ochoa, Jorge},
  title = {${title}},
  year = {${year}},
  month = {${date.toLocaleString("en-US", { month: "long" })}},
  day = {${day}},
  url = {${url}},
  journal = {ochoajorge.me},
  note = {Accessed: ${new Date().toISOString().split("T")[0]}}
}`;

  // APA format (7th edition)
  const apa = `Ochoa, J. (${year}, ${month}/${day}). *${title}* [Blog post]. ochoajorge.me. ${url}`;

  // MLA format (9th edition)
  const mla = `Ochoa, Jorge. "${title}." *ochoajorge.me*, ${day} ${date.toLocaleString("en-US", { month: "long" })} ${year}, ${url}.`;

  // JSON format for AI agents (structured citation)
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: author,
      jobTitle: "Specialist Technology Architect",
      affiliation: "Equifax LATAM"
    },
    citation: {
      bibtex,
      apa,
      mla
    },
    metadata: {
      url,
      title,
      publishedDate: datePublished,
      accessedDate: new Date().toISOString(),
      language: lang
    }
  }, null, 2);

  return { bibtex, apa, mla, json };
}

/**
 * Formats a citation for direct inclusion in LLM responses
 * Short, markdown-compatible format
 */
export function formatLLMCitation({
  title,
  author,
  url,
  datePublished,
}: {
  title: string;
  author: string;
  url: string;
  datePublished: string;
}): string {
  const date = new Date(datePublished);
  const year = date.getFullYear();

  return `According to ${author} (${year}) in "[${title}](${url})"`;
}