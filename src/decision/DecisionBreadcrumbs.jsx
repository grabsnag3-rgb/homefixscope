import { Link } from "react-router-dom";

function cleanCrumbLabel(label = "") {
  return String(label)
    .replace(/\bFiling Decision\b/gi, "")
    .replace(/\bClaim Estimate Decisions\b/gi, "")
    .replace(/\bClaim Process Decisions\b/gi, "")
    .replace(/\bClaim Evidence Decisions\b/gi, "")
    .replace(/\bClaims?\b/gi, "")
    .replace(/\bCoverage\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function DecisionBreadcrumbs({ crumbs = [] }) {
  const visibleCrumbs = crumbs
    .slice(0, 2)
    .map((crumb) => ({
      ...crumb,
      label: cleanCrumbLabel(crumb.label),
    }))
    .filter((crumb) => crumb.label && crumb.href);

  if (!visibleCrumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="decision-breadcrumbs">
      {visibleCrumbs.map((crumb, index) => {
        const isLast = index === visibleCrumbs.length - 1;

        return (
          <span
            key={`${crumb.label}-${index}`}
            className="decision-breadcrumbs__item"
          >
            <Link to={crumb.href} className="decision-breadcrumbs__link">
              {crumb.label}
            </Link>

            {!isLast ? (
              <span className="decision-breadcrumbs__sep" aria-hidden="true">
                →
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}