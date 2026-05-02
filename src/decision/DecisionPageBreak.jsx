export default function DecisionPageBreak() {
  return (
    <section className="decision-page-break" aria-hidden="true">
      <div className="decision-page-break__line" />

      <div className="decision-page-break__mark">
        <div className="decision-page-break__loop decision-page-break__loop--left" />
        <div className="decision-page-break__loop decision-page-break__loop--right" />
        <div className="decision-page-break__dot" />
      </div>
    </section>
  );
}