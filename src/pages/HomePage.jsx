import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import HomeSearch from "../components/HomeSearch";

const VERTICALS = [
  {
    key: "leak",
    label: "Leaks & water intrusion",
    description:
      "Repair timing, hidden damage risk, leak source uncertainty, temporary fixes, and quote decisions.",
  },
  {
    key: "roofing",
    label: "Roofing",
    description:
      "Patch-vs-replace choices, leak diagnosis, repair timing, material decisions, and roof quote scope.",
  },
  {
    key: "hvac",
    label: "HVAC",
    description:
      "Repair-vs-replace decisions, system age, urgent failures, contractor quotes, and comfort tradeoffs.",
  },
  {
    key: "plumbing",
    label: "Plumbing",
    description:
      "Leaks, clogs, fixture failures, pipe concerns, DIY-vs-pro choices, and repair quote questions.",
  },
  {
    key: "foundation",
    label: "Foundation & structure",
    description:
      "Cracks, settling, structural warning signs, repair timing, inspection decisions, and quote scope.",
  },
  {
    key: "electrical",
    label: "Electrical",
    description:
      "Safety concerns, breaker issues, fixture problems, DIY-vs-pro decisions, and electrical quote questions.",
  },
];

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchAllPublishedRows() {
      const pageSize = 1000;
      let from = 0;
      let allRows = [];

      while (true) {
        const { data, error } = await supabase
          .from("branch_seed_overview")
          .select("branch_key, page_id, page_status")
          .eq("page_status", "published")
          .range(from, from + pageSize - 1);

        if (error) throw error;

        const batch = data ?? [];
        allRows = [...allRows, ...batch];

        if (batch.length < pageSize) break;

        from += pageSize;
      }

      return allRows;
    }

    async function loadHome() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAllPublishedRows();

        if (!active) return;

        setRows(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load homepage.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  const verticalStats = useMemo(() => {
    const stats = new Map();

    for (const vertical of VERTICALS) {
      stats.set(vertical.key, {
        pageCount: 0,
        branchKeys: new Set(),
      });
    }

    for (const row of rows) {
      const branchKey = row.branch_key || "";
      const verticalKey = branchKey.split("_")[0];

      if (!stats.has(verticalKey)) {
        stats.set(verticalKey, {
          pageCount: 0,
          branchKeys: new Set(),
        });
      }

      const item = stats.get(verticalKey);

      if (row.page_id) {
        item.pageCount += 1;
      }

      if (branchKey) {
        item.branchKeys.add(branchKey);
      }
    }

    return stats;
  }, [rows]);

  const verticalCards = useMemo(() => {
    return VERTICALS.map((vertical) => {
      const stats = verticalStats.get(vertical.key);

      return {
        ...vertical,
        pageCount: stats?.pageCount ?? 0,
        branchCount: stats?.branchKeys?.size ?? 0,
      };
    });
  }, [verticalStats]);

  return (
    <main className="page-shell homepage-shell">
      <Helmet>
        <title>HomeFixScope</title>
        <meta
          name="description"
          content="Repair decisions for leaks, roofs, HVAC, plumbing, electrical, and structural problems."
        />
      </Helmet>

      <div className="page-width">
        <div className="home-stack">
          <section className="home-hero">
            <div className="home-hero-art home-axis-x" />

            <div className="home-brand-slab">
              <div className="home-brand-slab-inner">
                <div className="home-brand-slab__copy">
                  <div className="home-brand-kicker">Repair decision guides</div>
                  <div className="home-brand-name">HomeFixScope</div>
                  <p className="home-brand-deck">
                    Practical answers for leaks, roofs, HVAC, plumbing,
                    electrical, and structural problems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <HomeSearch />

          <section className="home-live-domain">
            <div className="section-rule">
              <span className="section-rule-label">
                Fix it, wait, DIY it, hire someone, replace it, or get another quote.
              </span>
              <span className="section-rule-line" />
            </div>

            <div className="home-domain-link home-domain-link--static">
              <div className="home-domain-main">
                <h2 className="home-domain-title">Repair decision library</h2>
                <p className="home-domain-body">
                  Browse practical decision guides for repair timing, DIY vs hire
                  choices, quote scope, replacement decisions, and diagnosis
                  uncertainty.
                </p>
              </div>

              <Link to="/share-your-situation" className="home-domain-cta">
                Share your repair situation
              </Link>
            </div>
          </section>

          <section className="home-featured">
            <div className="section-rule">
              <span className="section-rule-label">Repair areas</span>
              <span className="section-rule-line" />
            </div>

            {loading ? <p className="section-copy">Loading repair areas…</p> : null}
            {error ? <p className="section-copy">{error}</p> : null}

            {!loading && !error ? (
              <div className="home-vertical-grid">
                {verticalCards.map((vertical) => (
                  <Link
                    key={vertical.key}
                    to={`/${vertical.key}`}
                    className="home-vertical-card"
                  >
                    <div className="home-vertical-card__top">
                      <h3>{vertical.label}</h3>
                      <span>→</span>
                    </div>

                    <p>{vertical.description}</p>

                    <div className="home-vertical-card__meta">
                      <span>{vertical.pageCount.toLocaleString()} pages</span>
                      <span>{vertical.branchCount.toLocaleString()} question sets</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}