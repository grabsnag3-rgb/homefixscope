import { Link } from "react-router-dom";
import "./related-questions.css";

function normalizeRelatedItem(item) {
  if (typeof item === "string") {
    return {
      question: item,
      href: null,
    };
  }

  return {
    question: item?.title || item?.question || "",
    href: item?.slug ? `/p/${item.slug}` : null,
  };
}

export default function RelatedQuestions({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const normalized = items
    .map(normalizeRelatedItem)
    .filter((item) => item.question);

  if (!normalized.length) return null;

  return (
    <section className="related-questions" aria-labelledby="related-questions-heading">
      <div className="related-questions__head">
        <p id="related-questions-heading" className="related-questions__eyebrow">
          Related repair questions
        </p>
      </div>

      <ul className="list-reset related-questions__list">
        {normalized.map((item, index) => (
          <li key={`${item.question}-${index}`} className="related-questions__item">
            {item.href ? (
              <Link to={item.href} className="related-questions__link">
                <span className="related-questions__text">{item.question}</span>
                <span className="related-questions__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ) : (
              <div className="related-questions__link related-questions__link--disabled">
                <span className="related-questions__text">{item.question}</span>
                <span className="related-questions__arrow" aria-hidden="true">
                  →
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}