import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import { getDomainConfig } from "../lib/domainConfig";
import { titleFromSlug } from "../lib/routeHelpers";

const SITE_NAME = "HomeFixScope";

function cleanFamilyLabel(label) {
  return String(label || "")
    .replace(/\bOr\b/g, "or")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bVs\b/g, "vs")
    .replace(/\s+/g, " ")
    .trim();
}

function familySlugFromBranchKey(branchKey, domainSlug) {
  return String(branchKey || "")
    .replace(new RegExp(`^${domainSlug}_`), "")
    .replace(/_/g, "-");
}

function familyLabelFromBranch(row, domainSlug) {
  const label = row.branch_label || "";

  if (label.includes("→")) {
    const parts = label.split("→").map((part) => part.trim());
    return cleanFamilyLabel(parts[1] || parts[0]);
  }

  const familySlug = familySlugFromBranchKey(row.branch_key, domainSlug);
  return cleanFamilyLabel(titleFromSlug(familySlug));
}

export default function DomainPage() {
  const { domainSlug } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const domainConfig = useMemo(() => getDomainConfig(domainSlug), [domainSlug]);
  const domainTitle = domainConfig.label || titleFromSlug(domainSlug);

  useEffect(() => {
    let active = true;

    async function loadDomain() {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("branch_seed_overview")
          .select("branch_key, branch_label, page_id, page_status")
          .eq("page_status", "published")
          .ilike("branch_key", `${domainSlug}_%`);

        if (error) throw error;

        if (!active) return;
        setRows(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load repair area.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDomain();

    return () => {
      active = false;
    };
  }, [domainSlug]);

  const families = useMemo(() => {
    const map = new Map();

    for (const row of rows) {
      if (!row.branch_key) continue;

      if (!map.has(row.branch_key)) {
        const familySlug = familySlugFromBranchKey(row.branch_key, domainSlug);
        const familyLabel = familyLabelFromBranch(row, domainSlug);

        map.set(row.branch_key, {
          branchKey: row.branch_key,
          familySlug,
          familyLabel,
          href: `/${domainSlug}/${familySlug}`,
          pageCount: 0,
          description:
            domainConfig.families?.[familyLabel] ??
            "Browse repair decision pages in this question set and choose the situation closest to yours.",
        });
      }

      if (row.page_id) {
        map.get(row.branch_key).pageCount += 1;
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.familyLabel.localeCompare(b.familyLabel)
    );
  }, [rows, domainConfig, domainSlug]);

  return (
    <main className="page-shell domain-page">
      <Helmet>
        <title>{`${domainTitle} | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content={`Browse ${domainTitle.toLowerCase()} repair decision guides on HomeFixScope.`}
        />
      </Helmet>

      <div className="page-width">
        <Header />

        <section className="domain-hero">
          <p className="domain-hero__eyebrow">Repair area</p>
          <h1 className="domain-hero__title">{domainTitle}</h1>
          <p className="domain-hero__body">{domainConfig.domainIntro}</p>
        </section>

        <section className="domain-list-section">
          <div className="section-rule">
            <span className="section-rule-label">Question sets</span>
            <span className="section-rule-line" />
          </div>

          {loading ? <p className="section-copy">Loading repair area…</p> : null}
          {error ? <p className="section-copy">{error}</p> : null}

          {!loading && !error ? (
            <div className="domain-list">
              {families.map((item) => (
                <Link
                  key={item.branchKey}
                  to={item.href}
                  className="domain-row"
                >
                  <div className="domain-row__main">
                    <h2 className="domain-row__title">{item.familyLabel}</h2>
                    <p className="domain-row__body">{item.description}</p>

                    <p className="domain-row__meta">
                      {item.pageCount.toLocaleString()} repair guides
                    </p>
                  </div>

                  <div className="domain-row__arrow">→</div>
                </Link>
              ))}

              {families.length === 0 ? (
                <p className="section-copy">
                  No published repair question sets yet.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}