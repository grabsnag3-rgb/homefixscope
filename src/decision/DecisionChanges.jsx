import SectionRule from "../components/SectionRule";

export default function DecisionChanges({ items = [] }) {
  const visibleItems = Array.isArray(items)
    ? items.filter((item) => String(item || "").trim())
    : [];

  if (!visibleItems.length) return null;

  return (
    <section className="decision-changes" aria-labelledby="decision-changes-heading">
      <SectionRule label="What changes the answer" />

      <ul className="list-reset decision-changes__list">
        {visibleItems.map((item, index) => (
          <li key={`${item}-${index}`} className="decision-changes__item">
            <div className="decision-changes__row">
              <span className="decision-changes__marker" aria-hidden="true" />
              <span className="decision-changes__text">{item}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}