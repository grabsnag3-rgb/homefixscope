import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://homefixscope.com";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nwxcancqulxjwdiofyxy.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_qeHpjmBA_STovuCQL-fjDQ_U5eOEoy-";

const VERTICALS = ["plumbing", "electrical", "leak", "foundation", "roofing", "hvac"];

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

function getDomainSlug(branchKey = "") {
  return String(branchKey).split("_")[0] || "";
}

function getFamilySlug(branchKey = "") {
  const parts = String(branchKey).split("_");
  parts.shift();
  return parts.join("-");
}

async function fetchAllHomeFixRows() {
  const pageSize = 1000;
  let from = 0;
  let allRows = [];

  while (true) {
    const { data, error } = await supabase
      .from("branch_seed_overview")
      .select("branch_key, slug, page_status, published_at")
      .eq("page_status", "published")
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const batch = data ?? [];
    allRows = [...allRows, ...batch];

    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return allRows.filter((row) => {
    const domainSlug = getDomainSlug(row.branch_key);
    return VERTICALS.includes(domainSlug);
  });
}

async function main() {
  const urls = new Map();

  urls.set(`${SITE_URL}/`, {
    loc: `${SITE_URL}/`,
    lastmod: null,
  });

  urls.set(`${SITE_URL}/share-your-situation`, {
    loc: `${SITE_URL}/share-your-situation`,
    lastmod: null,
  });

  for (const vertical of VERTICALS) {
    const loc = `${SITE_URL}/${vertical}`;
    urls.set(loc, { loc, lastmod: null });
  }

  const rows = await fetchAllHomeFixRows();

  for (const row of rows) {
    const branchKey = row.branch_key || "";
    const domainSlug = getDomainSlug(branchKey);
    const familySlug = getFamilySlug(branchKey);

    if (!VERTICALS.includes(domainSlug)) continue;

    if (familySlug) {
      const clusterLoc = `${SITE_URL}/${domainSlug}/${familySlug}`;
      urls.set(clusterLoc, {
        loc: clusterLoc,
        lastmod: row.published_at || null,
      });
    }

    if (row.slug) {
      const pageLoc = `${SITE_URL}/p/${row.slug}`;
      urls.set(pageLoc, {
        loc: pageLoc,
        lastmod: row.published_at || null,
      });
    }
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