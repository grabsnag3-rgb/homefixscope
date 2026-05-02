import InsetPlane from "../components/InsetPlane";

export default function DecisionBottomLine({ bottomLine }) {
  const text =
    bottomLine ||
    "Use the visible problem, safety risk, damage spread, system age, and quote scope to decide whether to fix it now, wait, DIY it, hire a pro, or get another opinion.";

  return (
    <section className="decision-bottom-line" aria-labelledby="decision-bottom-line">
      <InsetPlane>
        <div className="decision-bottom-line__inner">
          <p id="decision-bottom-line" className="decision-bottom-line__eyebrow">
            Bottom line
          </p>

          <p className="decision-bottom-line__text">{text}</p>
        </div>
      </InsetPlane>
    </section>
  );
}