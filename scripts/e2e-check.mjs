import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

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
  const reactionsRes = await fetch(`${BASE_URL}/api/reactions/${firstSlug}?lang=es`);
  if (reactionsRes.status === 200) {
    const { count } = await reactionsRes.json();
    if (typeof count !== "number") {
      throw new Error("Reactions GET returned a non-numeric count");
    }
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
