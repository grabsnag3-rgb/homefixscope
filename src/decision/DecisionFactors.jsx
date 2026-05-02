import SectionRule from "../components/SectionRule";

function repairLabel(label, index) {
  const fallbackLabels = [
    "What to check first",
    "Cost and risk factors",
    "DIY vs pro signals",
  ];

  return label || fallbackLabels[index] || "Repair factor";
}

export default function DecisionFactors({ factors = [] }) {
  const visibleFactors = Array.isArray(factors) ? factors.filter(Boolean) : [];

  if (!visibleFactors.length) return null;

  return (
    <section className="decision-factors" aria-labelledby="decision-factors-heading">
      <SectionRule label="What to check first" />

      <div className="decision-factors__list">
        {visibleFactors.map((factor, index) => (
          <article
            className="decision-factor"
            key={`${repairLabel(factor.label, index)}-${index}`}
          >
            <h2 className="decision-factor__title">
              {repairLabel(factor.label, index)}
            </h2>

            {factor.body ? (
              <p className="decision-factor__body">{factor.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}