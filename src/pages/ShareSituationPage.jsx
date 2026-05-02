import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import "./share-situation.css";

const REPAIR_AREAS = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "leaks", label: "Leaks & water intrusion" },
  { value: "foundation", label: "Foundation & structure" },
  { value: "roofing", label: "Roofing" },
  { value: "hvac", label: "HVAC" },
];

export default function ShareSituationPage() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const initialVertical = useMemo(() => {
    return searchParams.get("vertical") || "";
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="page-shell share-situation-page">
      <Helmet>
        <title>Share your repair situation | HomeFixScope</title>
        <meta
          name="description"
          content="Share the repair problem, quote, urgency, and home-system decision you are trying to sort through."
        />
      </Helmet>

      <div className="page-width">
        <Header />

        <section className="share-situation-hero">
          <div className="section-label">Share your repair situation</div>

          <h1>Tell us what broke and what you&apos;re trying to decide.</h1>

          <p>
            HomeFixScope is building clearer repair decision guides for leaks,
            roofs, HVAC, plumbing, electrical, and structural problems. Share
            what happened, what quote you got, what feels unclear, and how urgent
            it seems.
          </p>
        </section>

        {submitted ? (
          <section className="share-situation-success">
            <div className="section-label">Received</div>
            <h2>Thanks — this helps shape HomeFixScope.</h2>
            <p>
              We cannot give individual legal, engineering, contractor, or
              professional advice, but real repair situations help us build
              clearer examples, checklists, and decision guides.
            </p>
          </section>
        ) : (
          <form className="share-situation-form" onSubmit={handleSubmit}>
            <label>
              <span>Repair area</span>
              <select name="vertical" defaultValue={initialVertical}>
                <option value="">Choose one</option>
                {REPAIR_AREAS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>What happened?</span>
              <textarea
                name="situation"
                rows="5"
                placeholder="Example: A ceiling stain keeps growing after rain, and I am not sure if the leak is from the roof, flashing, or plumbing."
              />
            </label>

            <label>
              <span>What are you trying to decide?</span>
              <textarea
                name="decision_question"
                rows="4"
                placeholder="Example: I am trying to decide whether to patch it now, get another quote, open the ceiling, or wait until the next storm."
              />
            </label>

            <label>
              <span>DIY or contractor?</span>
              <select name="repair_path" defaultValue="">
                <option value="">Choose one</option>
                <option value="diy">I am considering DIY</option>
                <option value="contractor">I have talked to a contractor</option>
                <option value="both">I am comparing DIY vs hiring someone</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </label>

            <label>
              <span>Approximate quote or cost, optional</span>
              <input
                name="approximate_amount"
                placeholder="Example: $850 repair quote / $6,500 replacement quote"
              />
            </label>

            <label>
              <span>Urgency</span>
              <select name="urgency" defaultValue="">
                <option value="">Choose one</option>
                <option value="active_problem">Active problem right now</option>
                <option value="soon">Needs attention soon</option>
                <option value="planning">Planning ahead</option>
                <option value="unsure">Not sure how urgent it is</option>
              </select>
            </label>

            <label>
              <span>Home or system age, optional</span>
              <input
                name="home_or_system_age"
                placeholder="Example: 18-year-old HVAC system / 1960s house / 12-year-old roof"
              />
            </label>

            <label>
              <span>Email, optional</span>
              <input name="email" type="email" placeholder="you@example.com" />
            </label>

            <button type="submit">Submit repair situation</button>
          </form>
        )}

        <p className="share-situation-disclaimer">
          HomeFixScope does not provide legal, engineering, contractor, code, or
          emergency advice. Submissions may be used to improve future examples,
          checklists, and repair decision guides.
        </p>
      </div>
    </main>
  );
}