export default function DecisionHero({ hero }) {
  const question = hero?.question || "What should you do next?";

  return (
    <section className="decision-hero" aria-labelledby="decision-question">
      <div className="decision-hero__field">
        <div className="decision-hero__question-wrap">
          <p className="decision-hero__eyebrow">Repair question</p>
          <h1 id="decision-question" className="decision-hero__title">
            {question}
          </h1>
        </div>
      </div>
    </section>
  );
}