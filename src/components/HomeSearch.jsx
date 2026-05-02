import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { makeDecisionHref } from "../lib/routeHelpers";
import "./home-search.css";

function scoreResult(result, query) {
  const q = query.trim().toLowerCase();
  const title = (result.title || "").toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  return 20;
}

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("pages")
          .select("id, slug, title, seed_id, page_status")
          .eq("page_status", "published")
          .ilike("title", `%${trimmed}%`)
          .limit(8);

        if (error) throw error;

        const pageRows = data ?? [];
        const seedIds = [...new Set(pageRows.map((row) => row.seed_id).filter(Boolean))];

        let branchRows = [];
        if (seedIds.length) {
          const branchResponse = await supabase
            .from("branch_seed_overview")
            .select("seed_id, branch_label")
            .in("seed_id", seedIds);

          if (branchResponse.error) throw branchResponse.error;
          branchRows = branchResponse.data ?? [];
        }

        const branchMap = new Map(
          branchRows.map((row) => [row.seed_id, row.branch_label])
        );

        const enriched = pageRows
          .map((row) => ({
            ...row,
            branch_label: branchMap.get(row.seed_id) || "",
          }))
          .filter((row) => row.branch_label && row.slug);

        const ranked = enriched.sort(
          (a, b) => scoreResult(b, trimmed) - scoreResult(a, trimmed)
        );

        setResults(ranked);
        setOpen(true);
      } catch (err) {
        console.error("Homepage search failed:", err);
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

const showPanel =
  open && (loading || results.length > 0 || query.trim().length >= 2);

return (
  <div className="home-search" ref={rootRef}>
    <label htmlFor="home-search-input" className="sr-only">
      Search questions
    </label>

    <input
      id="home-search-input"
      type="search"
      className="home-search__input"
      placeholder="Search questions"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onFocus={() => {
        if (results.length > 0) {
          setOpen(true);
        }
      }}
    />

    {showPanel ? (
      <div className="home-search__panel">
        {loading ? (
          <div className="home-search__empty">Searching…</div>
        ) : results.length > 0 ? (
          <ul className="home-search__list">
            {results.map((result) => (
              <li key={result.id} className="home-search__item">
                <Link
                  to={makeDecisionHref(result.branch_label, result.slug)}
                  className="home-search__link"
                  onClick={() => setOpen(false)}
                >
                  <span className="home-search__title">{result.title}</span>
                  <span className="home-search__meta">
                    {result.branch_label.replaceAll("→", "·")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : query.trim().length >= 2 ? (
          <div className="home-search__empty">No matching questions yet.</div>
        ) : null}
      </div>
    ) : null}
  </div>
);
}