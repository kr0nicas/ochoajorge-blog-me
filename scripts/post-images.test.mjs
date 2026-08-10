import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { createServer } from "node:http";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const execFileP = promisify(execFile);

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "post-images.mjs");

const FIXTURE = `---
title: "Post de prueba"
description: "Descripción de prueba para el test del script de imágenes generadas."
date: "2026-08-09"
tags: ["arquitectura"]
pillar: "arquitectura"
lang: "es"
draft: true
---

Intro del post.

## El problema

Texto del problema.

## Una sección sin imagen

Más texto.
`;

const RESPONSE = {
    cover: { url: "https://blob.example/posts/post-prueba/cover.png", alt: "Cover alt" },
    inline: [
        {
            url: "https://blob.example/posts/post-prueba/inline-1.png",
            alt: "Diagrama del problema",
            afterHeading: "## El problema",
        },
        {
            url: "https://blob.example/posts/post-prueba/inline-2.png",
            alt: "Huérfana",
            afterHeading: "## Heading que no existe",
        },
    ],
};

function makeContentRoot() {
    const root = mkdtempSync(path.join(tmpdir(), "post-images-test-"));
    mkdirSync(path.join(root, "es"), { recursive: true });
    writeFileSync(path.join(root, "es", "post-prueba.mdx"), FIXTURE);
    return root;
}

async function runScript(root, url, extraArgs = [], expectFailure = false) {
    try {
        const { stdout } = await execFileP(
            process.execPath,
            [SCRIPT, "post-prueba", "es", ...extraArgs],
            {
                env: {
                    ...process.env,
                    POST_IMAGES_CONTENT_ROOT: root,
                    N8N_IMAGES_WEBHOOK_URL: url,
                    N8N_IMAGES_WEBHOOK_SECRET: "test-secret",
                },
                encoding: "utf8",
            }
        );
        return { code: 0, out: stdout };
    } catch (err) {
        if (expectFailure) return { code: err.code, out: String(err.stdout ?? "") };
        throw err;
    }
}

async function withMockServer(payload, fn) {
    const requests = [];
    const server = createServer((req, res) => {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
            requests.push({ headers: req.headers, body: JSON.parse(body) });
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(payload));
        });
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const url = `http://127.0.0.1:${server.address().port}/webhook`;
    try {
        return await fn(url, requests);
    } finally {
        server.close();
    }
}

// 1. Happy path: cover al frontmatter, inline con heading exacto insertada, huérfana avisada
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    const { out } = await runScript(root, url);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.match(patched, /coverImage: "https:\/\/blob\.example\/posts\/post-prueba\/cover\.png"/);
    assert.match(patched, /coverImageAlt: "Cover alt"/);
    assert.match(patched, /## El problema\n\n!\[Diagrama del problema\]\(https:\/\/blob\.example\/posts\/post-prueba\/inline-1\.png\)\n/);
    assert.ok(!patched.includes("inline-2.png"), "la huérfana no se inserta");
    assert.match(out, /## Heading que no existe/);
    assert.match(out, /inline-2\.png/);
    // El request cumple el contrato
    const req = requests[0];
    assert.equal(req.headers["x-webhook-secret"], "test-secret");
    assert.equal(req.body.slug, "post-prueba");
    assert.equal(req.body.lang, "es");
    assert.equal(req.body.pillar, "arquitectura");
    assert.equal(req.body.maxInlineImages, 3);
    assert.ok(req.body.content.includes("## El problema"));
    assert.ok(!req.body.content.includes("title:"), "content va sin frontmatter");
    rmSync(root, { recursive: true, force: true });
});

// 2. Idempotencia: con coverImage presente no toca nada y no llama al webhook
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    await runScript(root, url);
    const afterFirst = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    await runScript(root, url);
    const afterSecond = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(afterFirst, afterSecond);
    assert.equal(requests.length, 1, "la segunda ejecución no llama al webhook");
    rmSync(root, { recursive: true, force: true });
});

// 3. --force: regenera (reemplaza coverImage y vuelve a llamar)
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    await runScript(root, url);
    await runScript(root, url, ["--force"]);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(requests.length, 2);
    assert.equal(patched.match(/coverImage:/g).length, 1, "sin duplicar coverImage");
    assert.equal(patched.match(/inline-1\.png/g).length, 1, "sin duplicar inline en --force (URL determinista)");
    rmSync(root, { recursive: true, force: true });
});

// 4. cover null: solo inline, frontmatter intacto
await withMockServer({ ...RESPONSE, cover: null }, async (url) => {
    const root = makeContentRoot();
    await runScript(root, url);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.ok(!patched.includes("coverImage"));
    assert.ok(patched.includes("inline-1.png"));
    rmSync(root, { recursive: true, force: true });
});

// 5. Webhook caído → exit 0, archivo intacto
{
    const root = makeContentRoot();
    const { code } = await runScript(root, "http://127.0.0.1:1/webhook");
    assert.equal(code, 0);
    const untouched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(untouched, FIXTURE);
    rmSync(root, { recursive: true, force: true });
}

// 6. Env vars ausentes → exit 0 con aviso
{
    const root = makeContentRoot();
    const out = execFileSync(
        process.execPath,
        [SCRIPT, "post-prueba", "es"],
        {
            env: { ...process.env, POST_IMAGES_CONTENT_ROOT: root, N8N_IMAGES_WEBHOOK_URL: "", N8N_IMAGES_WEBHOOK_SECRET: "" },
            encoding: "utf8",
        }
    );
    assert.match(out, /N8N_IMAGES_WEBHOOK_URL/);
    rmSync(root, { recursive: true, force: true });
}

// 7. Post inexistente → exit 1 (error del agente, debe fallar fuerte)
await withMockServer(RESPONSE, async (url) => {
    const root = makeContentRoot();
    const { code } = await runScript(root.replace(/post-images-test-.*/, "no-existe"), url, [], true);
    assert.equal(code, 1);
    rmSync(root, { recursive: true, force: true });
});

// 8. Strings hostiles del webhook: nunca corrompen el MDX
await withMockServer(
    {
        cover: {
            url: "https://blob.example/posts/post-prueba/cover.png",
            alt: 'Línea1\nLínea2 "comillas" C:\\ruta y $& patrón',
        },
        inline: [
            {
                url: "javascript:alert(1)",
                alt: "URL insegura",
                afterHeading: "## El problema",
            },
            {
                url: "https://blob.example/posts/post-prueba/inline-1.png",
                alt: "Alt con [brackets] {llaves} `backticks`",
                afterHeading: "## El problema",
            },
        ],
    },
    async (url) => {
        const root = makeContentRoot();
        await runScript(root, url);
        const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
        const parsed = matter(patched); // no lanza → YAML sigue válido
        assert.equal(parsed.data.coverImage, "https://blob.example/posts/post-prueba/cover.png");
        assert.ok(!parsed.data.coverImageAlt.includes("\n"), "alt en una sola línea");
        assert.ok(!patched.includes("javascript:alert"), "URL insegura fuera");
        assert.match(patched, /!\[Alt con brackets llaves backticks\]/);
        rmSync(root, { recursive: true, force: true });
    }
);

// 9. El patch de cover solo toca el bloque de frontmatter, nunca el cuerpo
await withMockServer(RESPONSE, async (url) => {
    const root = mkdtempSync(path.join(tmpdir(), "post-images-test-"));
    mkdirSync(path.join(root, "es"), { recursive: true });
    const fixtureWithFencedCover = `---
title: "Post de prueba"
description: "Descripción de prueba para el test del script de imágenes generadas."
date: "2026-08-09"
tags: ["arquitectura"]
pillar: "arquitectura"
lang: "es"
draft: true
---

Intro del post.

## El problema

Ejemplo de frontmatter en un fence, no debe tocarse:

\`\`\`yaml
coverImage: "fake"
\`\`\`

## Una sección sin imagen

Más texto.
`;
    writeFileSync(path.join(root, "es", "post-prueba.mdx"), fixtureWithFencedCover);
    await runScript(root, url);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.match(patched, /```yaml\ncoverImage: "fake"\n```/, "el coverImage dentro del fence del cuerpo queda intacto");
    const parsed = matter(patched);
    assert.equal(parsed.data.coverImage, "https://blob.example/posts/post-prueba/cover.png", "el frontmatter sí recibe el coverImage real");
    rmSync(root, { recursive: true, force: true });
});

console.log("post-images tests passed.");
