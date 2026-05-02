import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://homefixscope.com";

// Use Vite-style env names first, then script-style names, then fallback.
// This lets the script work locally and in other environments.
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nwxcancqulxjwdiofyxy.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_qeHpjmBA_STovuCQL-fjDQ_U5eOEoy-";

const VERTICALS = ["plumbing", "electrical", "leaks", "foundation", "roofing", "hvac"];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase env vars.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function xmlEscape(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlTag(loc, lastmod) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function familySlugFromBranchKey(branchKey = "") {
  const parts = String(branchKey).split("_");
  parts.shift();
  return parts.join("-");
}

async function fetchAll(table, select, applyFilters) {
  const pageSize = 1000;
  let from = 0;
  let allRows = [];

  while (true) {
    let query = supabase
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);

    query = applyFilters(query);

    const { data, error } = await query;

    if (error) throw error;

    const batch = data ?? [];
    allRows = [...allRows, ...batch];

    if (batch.length < pageSize) break;

    from += pageSize;
  }

  return allRows;
}

async function main() {
  const urls = new Map();

  // Static routes
  urls.set(`${SITE_URL}/`, {
    loc: `${SITE_URL}/`,
    lastmod: null,
  });

  urls.set(`${SITE_URL}/share-your-situation`, {
    loc: `${SITE_URL}/share-your-situation`,
    lastmod: null,
  });

  // Domain routes
  for (const vertical of VERTICALS) {
    const loc = `${SITE_URL}/${vertical}`;
    urls.set(loc, {
      loc,
      lastmod: null,
    });
  }

  // Decision page routes
  const pages = await fetchAll(
    "pages",
    "slug, page_status, updated_at, published_at",
    (query) => query.eq("page_status", "published")
  );

  for (const page of pages ?? []) {
    if (!page.slug) continue;

    const loc = `${SITE_URL}/p/${page.slug}`;
    const lastmod = page.updated_at || page.published_at || null;

    urls.set(loc, { loc, lastmod });
  }

  // Cluster/question-set routes from branch_key, not branch_label.
  const branches = await fetchAll(
    "branch_seed_overview",
    "branch_key, page_status",
    (query) => query.eq("page_status", "published")
  );

  for (const row of branches ?? []) {
    const branchKey = row.branch_key || "";
    if (!branchKey.includes("_")) continue;

    const domainSlug = branchKey.split("_")[0];
    if (!VERTICALS.includes(domainSlug)) continue;

    const familySlug = familySlugFromBranchKey(branchKey);
    if (!familySlug) continue;

    const domainLoc = `${SITE_URL}/${domainSlug}`;
    const familyLoc = `${SITE_URL}/${domainSlug}/${familySlug}`;

    urls.set(domainLoc, {
      loc: domainLoc,
      lastmod: null,
    });

    urls.set(familyLoc, {
      loc: familyLoc,
      lastmod: null,
    });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls.values())
      .sort((a, b) => a.loc.localeCompare(b.loc))
      .map((entry) => buildUrlTag(entry.loc, entry.lastmod)),
    "</urlset>",
    "",
  ].join("\n");

  const outputPath = path.resolve("public", "sitemap.xml");
  await fs.writeFile(outputPath, xml, "utf8");

  console.log(`Sitemap written to ${outputPath}`);
  console.log(`URL count: ${urls.size}`);
}

main().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});