import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

try {
	process.loadEnvFile(".env.local");
} catch {
	// no .env.local (e.g. CI) — the reactions endpoint will respond 503 and the POST checks are skipped
}

const HOST = "0.0.0.0";
const FETCH_HOST = "127.0.0.1";
const PORT = 4173;
const BASE_URL = `http://${FETCH_HOST}:${PORT}`;

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/es`);
      if (res.ok) return;
    } catch {
      // ignore
    }
    await setTimeout(1000);
  }
  throw new Error("Dev server did not start within 30 seconds");
}

async function runChecks() {
  const summaryRes = await fetch(`${BASE_URL}/api/posts/summary`);
  if (!summaryRes.ok) throw new Error("Summary API failed");
  const { summary } = await summaryRes.json();
  const esSummary = summary.find((item) => item.locale === "es");
  if (!esSummary || esSummary.posts.length === 0) {
    throw new Error("No Spanish posts found for reference");
  }
  const firstSlug = esSummary.posts[0].slug;

  const routes = ["/es", "/es/blog", `/es/blog/${firstSlug}`];
  for (const route of routes) {
    const res = await fetch(`${BASE_URL}${route}`);
    if (!res.ok) throw new Error(`Route ${route} responded ${res.status}`);
  }

  // Reactions API — 200 with numeric count when Upstash is configured, 503 otherwise
  const reactionUrl = `${BASE_URL}/api/reactions/${firstSlug}?lang=es`;
  const reactionsRes = await fetch(reactionUrl);
  if (reactionsRes.status === 200) {
    const { count: before } = await reactionsRes.json();
    if (typeof before !== "number") {
      throw new Error("Reactions GET returned a non-numeric count");
    }

    // POST increments, and the new value persists on a follow-up GET
    const postRes = await fetch(reactionUrl, { method: "POST" });
    if (postRes.status !== 200) {
      throw new Error(`Reactions POST responded ${postRes.status}`);
    }
    const { count: after } = await postRes.json();
    if (after !== before + 1) {
      throw new Error(`Reactions POST did not increment (${before} -> ${after})`);
    }
    const followUpRes = await fetch(reactionUrl);
    const { count: persisted } = await followUpRes.json();
    if (persisted !== after) {
      throw new Error(`Reactions count did not persist (${after} -> ${persisted})`);
    }

    // Undo exactly this test's own +1 atomically — never clobbers concurrent real reactions
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    await redis.decr(`reactions:es:${firstSlug}`);
  } else if (reactionsRes.status !== 503) {
    throw new Error(
      `Reactions GET responded ${reactionsRes.status} (expected 200 or 503)`
    );
  }

  // Invalid lang must be rejected
  const badLangRes = await fetch(`${BASE_URL}/api/reactions/${firstSlug}?lang=xx`);
  if (badLangRes.status !== 400) {
    throw new Error(
      `Reactions GET with invalid lang responded ${badLangRes.status} (expected 400)`
    );
  }

  // Unknown slug must be rejected
  const badSlugRes = await fetch(`${BASE_URL}/api/reactions/not-a-real-post?lang=es`);
  if (badSlugRes.status !== 404) {
    throw new Error(
      `Reactions GET with unknown slug responded ${badSlugRes.status} (expected 404)`
    );
  }
}

async function main() {
  const server = spawn("npm", ["run", "dev", "--", "--hostname", HOST, "--port", String(PORT)], {
    stdio: ["ignore", "inherit", "inherit"],
    env: { ...process.env, NODE_ENV: "development" },
  });

  try {
    await waitForServer();
    await runChecks();
    console.log("End-to-end checks passed.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.kill("SIGTERM");
    await setTimeout(1000);
  }
}

main();
