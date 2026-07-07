import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { faqs } from "../../data";
import { AvailabilityPill } from "../ui";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section faq-section">
      <div className="faq-grid">
        <div>
          <AvailabilityPill className="inline-availability" />
          <h2>FREQUENTLY ASKED QUESTIONS</h2>
          <p className="lead">
            Here are answers to some of the most common questions I receive as a freelance designer. If you don’t see
            your question here, feel free to reach out—I’m happy to help!
          </p>
        </div>
        <div className="accordion faq-list">
          {faqs.map((faq, index) => (
            <div className={`accordion-item ${openIndex === index ? "open" : ""}`} key={faq.question}>
              <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span>
                  {index + 1}. {faq.question}
                </span>
                <ChevronUp size={22} />
              </button>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
