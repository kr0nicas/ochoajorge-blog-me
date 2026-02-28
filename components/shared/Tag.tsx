import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagProps {
    name: string;
    /** When true, renders as a <Link> to /tags/[name]. Default: true */
    linkable?: boolean;
    className?: string;
    /** Show the count of posts for this tag */
    count?: number;
}

/**
 * Tag — reusable pill component.
 * When `linkable` is true (default), wraps the pill in a Next.js Link
 * pointing to /tags/[tag]. When false, renders a plain <span>.
 */
export function Tag({ name, linkable = true, className, count }: TagProps) {
    const pill = (
        <span className={cn("tag", "gap-1.5", className)}>
            {name}
            {count !== undefined && (
                <span className="rounded-full bg-[var(--brand)] bg-opacity-20 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--brand-light)]">
                    {count}
                </span>
            )}
        </span>
    );

    if (!linkable) return pill;

    return (
        <Link
            href={`/tags/${encodeURIComponent(name.toLowerCase())}`}
            aria-label={`Browse posts tagged "${name}"`}
        >
            {pill}
        </Link>
    );
}
