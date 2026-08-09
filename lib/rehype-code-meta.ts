/**
 * Rehype plugin: copies the code fence meta (```python title="worker.py")
 * onto the <pre> element as data attributes so the MDX `pre` override
 * (Terminal) can render a titled terminal window.
 *
 * Must run BEFORE rehype-highlight (which rewrites the <code> children).
 */

interface HastElement {
    type: string;
    tagName?: string;
    children?: HastElement[];
    data?: { meta?: string };
    properties?: Record<string, unknown>;
}

const TITLE_RE = /(?:title|filename)="([^"]+)"/;
const LANG_RE = /language-(\S+)/;

function extractLanguage(code: HastElement): string | undefined {
    const className = code.properties?.className;
    const classes = Array.isArray(className) ? className.map(String) : [String(className ?? "")];
    for (const cls of classes) {
        const match = LANG_RE.exec(cls);
        if (match) return match[1];
    }
    return undefined;
}

function visit(node: HastElement): void {
    if (node.tagName === "pre" && node.children) {
        const code = node.children.find((child) => child.tagName === "code");
        if (code) {
            const meta = code.data?.meta ?? "";
            const title = TITLE_RE.exec(meta)?.[1];
            const language = extractLanguage(code);
            node.properties = {
                ...node.properties,
                ...(title ? { dataTitle: title } : {}),
                ...(language ? { dataLanguage: language } : {}),
            };
        }
    }
    for (const child of node.children ?? []) visit(child);
}

export function rehypeCodeMeta() {
    return (tree: HastElement) => {
        visit(tree);
    };
}
