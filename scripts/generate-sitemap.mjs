import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://lossscope.com";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://nwxcancqulxjwdiofyxy.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_qeHpjmBA_STovuCQL-fjDQ_U5eOEoy-";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase env vars.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function slugifyLabel(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("→", " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseBranchLabel(branchLabel = "") {
  const parts = String(branchLabel)
    .split("→")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    domainLabel: parts[0] || "",
    familyLabel: parts[1] || "",
  };
}

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

  urls.set(`${SITE_URL}/`, {
    loc: `${SITE_URL}/`,
    lastmod: null,
  });

  urls.set(`${SITE_URL}/share-your-situation`, {
    loc: `${SITE_URL}/share-your-situation`,
    lastmod: null,
  });

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

  const branches = await fetchAll(
    "branch_seed_overview",
    "branch_label, page_status",
    (query) => query.eq("page_status", "published")
  );

  for (const row of branches ?? []) {
    const { domainLabel, familyLabel } = parseBranchLabel(row.branch_label);

    if (!domainLabel) continue;

    const domainSlug = slugifyLabel(domainLabel);
    const domainLoc = `${SITE_URL}/${domainSlug}`;

    urls.set(domainLoc, {
      loc: domainLoc,
      lastmod: null,
    });

    if (!familyLabel) continue;

    const familySlug = slugifyLabel(familyLabel);
    const familyLoc = `${SITE_URL}/${domainSlug}/${familySlug}`;

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