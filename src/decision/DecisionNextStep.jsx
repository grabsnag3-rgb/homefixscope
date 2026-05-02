import SectionRule from "../components/SectionRule";

export default function DecisionNextStep({ nextStep }) {
  const title = nextStep?.title || "What to do from here";
  const body = nextStep?.body;

  if (!body) return null;

  return (
    <section className="decision-guidance decision-next-step">
      <SectionRule label="Next step" />

      <article className="decision-guidance__card">
        <h2 className="decision-guidance__title">{title}</h2>
        <p className="decision-guidance__body">{body}</p>
      </article>
    </section>
  );
}