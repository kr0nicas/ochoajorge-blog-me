import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagProps {
    name: string;
    linkable?: boolean;
    className?: string;
    count?: number;
    lang?: string;
}

export function Tag({ name, linkable = true, className, count, lang = "es" }: TagProps) {
    const isSpanish = lang === "es";
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
            href={`/${lang}/tags/${encodeURIComponent(name.toLowerCase())}`}
            aria-label={isSpanish ? `Ver posts con la etiqueta "${name}"` : `Browse posts tagged "${name}"`}
        >
            {pill}
        </Link>
    );
}
