// Runs before `vite build` (prebuild hook on Vercel).
// Fetches the dynamic sitemap from the Supabase edge function and writes it
// to public/sitemap.xml so the deployed static file always reflects the
// latest blog posts. Falls back gracefully (keeps existing file) on error
// so the build never breaks because of a transient edge-function issue.

import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SUPABASE_PROJECT_ID = "ocqwdmqjtegyqjclfvfm";
const ENDPOINT = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/generate-sitemap`;
const OUTPUT = resolve("public/sitemap.xml");

async function main() {
  console.log(`[sitemap] fetching ${ENDPOINT}`);
  try {
    const res = await fetch(ENDPOINT, {
      headers: { Accept: "application/xml" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    if (!xml.includes("<urlset") || !xml.includes("<loc>")) {
      throw new Error("response does not look like a sitemap");
    }
    const count = (xml.match(/<loc>/g) ?? []).length;
    writeFileSync(OUTPUT, xml);
    console.log(`[sitemap] wrote public/sitemap.xml (${count} URLs)`);
  } catch (err) {
    console.warn(`[sitemap] fetch failed: ${err?.message ?? err}`);
    if (existsSync(OUTPUT)) {
      console.warn(`[sitemap] keeping existing public/sitemap.xml`);
    } else {
      console.warn(`[sitemap] no existing sitemap; build will continue without one`);
    }
  }
}

main();