import SectionRule from "../components/SectionRule";

export default function DecisionException({ exception }) {
  const title = exception?.title || "When to call a pro";
  const body = exception?.body;

  if (!body) return null;

  return (
    <section className="decision-guidance decision-exception">
      <SectionRule label={title} />

      <article className="decision-guidance__card">
        <p className="decision-guidance__body">{body}</p>
      </article>
    </section>
  );
}