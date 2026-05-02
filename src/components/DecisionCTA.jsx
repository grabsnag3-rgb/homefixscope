import { Link } from "react-router-dom";
import "./decision-cta.css";

export default function DecisionCTA({
  variant = "default",
  vertical,
  pageId,
  sourceSlug,
}) {
  const params = new URLSearchParams();

  if (vertical) params.set("vertical", vertical);
  if (pageId) params.set("page_id", pageId);
  if (sourceSlug) params.set("source", sourceSlug);

  const href = `/share-your-situation${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  return (
    <section className={`decision-cta decision-cta--${variant}`}>
      <div className="decision-cta__label">Still unsure?</div>

      <h2 className="decision-cta__title">Have a repair situation?</h2>

      <p className="decision-cta__body">
        Share what broke, what quote you got, and what you&apos;re trying to
        decide. HomeFixScope uses real repair situations to make these guides
        more useful.
      </p>

      <Link className="decision-cta__button" to={href}>
        Share your repair situation
      </Link>
    </section>
  );
}