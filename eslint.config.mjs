import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Legacy standalone build scripts — pre-existing lint debt, slated for removal in Fase 4 cleanup
    "scripts/check-og-images.mjs",
    "scripts/check-posts.mjs",
    "scripts/generate-ai-seo-image.js",
    "scripts/generate-og-images.js",
    "scripts/verify-og-images.mjs",
  ]),
]);

export default eslintConfig;
