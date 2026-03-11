"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Post } from "@/lib/types";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PostCard } from "@/components/blog/PostCard";

interface PostGridProps {
  posts: Post[];
  lang: string;
  initialCount?: number;
  loadStep?: number;
}

export function PostGrid({
  posts,
  lang,
  initialCount = 8,
  loadStep = 6,
}: PostGridProps) {
  const total = posts.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, total)
  );
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(initialCount, total));
  }, [initialCount, total]);

  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);

  const loadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount((prev) => Math.min(total, prev + loadStep));
    });
  }, [loadStep, total]);

  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= total) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < total) {
          loadMore();
        }
      },
      { rootMargin: "120px", threshold: 0.5 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, total, loadMore]);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2" role="list">
        {visiblePosts.map((post, index) => (
          <li key={post.slug}>
            <AnimatedSection delay={(index % 6) * 0.08}>
              <PostCard post={post} lang={lang} />
            </AnimatedSection>
          </li>
        ))}
      </ul>
      {visibleCount < total && (
        <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="rounded-full border border-[var(--border)] px-6 py-2 text-sm font-semibold transition-colors hover:border-[var(--brand-light)] hover:text-[var(--brand-light)] disabled:opacity-60"
          >
            {isPending ? "Cargando más…" : "Cargar más artículos"}
          </button>
          <p className="text-xs text-[var(--text-muted)]">
            Mantente al tanto, cargamos más posts automáticamente cuando llegas abajo.
          </p>
        </div>
      )}
    </>
  );
}
