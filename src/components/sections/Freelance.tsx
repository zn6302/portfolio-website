import { freelance } from "../../data";
import { useLocale } from "../../hooks";
import { MaskHeading } from "../ui";

const EMAIL = "znye.6302@gmail.com";

export function Freelance() {
  const { locale, t } = useLocale();
  const { offers, cases } = freelance[locale];
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(t.freelanceMailSubject)}`;

  return (
    <section className="section freelance-section" id="freelance" aria-label={t.freelanceLabel}>
      <div className="section-head">
        <span className="section-eyebrow" aria-hidden="true">06 / 07</span>
        <MaskHeading text="FREELANCE" />
        <p className="lead" data-scroll-reveal data-scroll-reveal-delay="0.12">
          {t.freelanceLead}
        </p>
      </div>

      <h3 className="freelance-subheading" data-scroll-reveal>
        {t.freelanceOffersHeading}
      </h3>
      <ul className="freelance-offers" data-scroll-reveal data-scroll-reveal-delay="0.12">
        {offers.map((offer) => (
          <li key={offer.title} className="freelance-offer">
            <span className="freelance-offer-title">{offer.title}</span>
            <span className="freelance-offer-items">{offer.items.join(" · ")}</span>
          </li>
        ))}
      </ul>

      <h3 className="freelance-subheading" data-scroll-reveal>
        {t.freelanceCasesHeading}
      </h3>
      <div className="freelance-cases">
        {cases.map((item) => (
          <article
            key={item.slug}
            className="freelance-case"
            data-scroll-reveal
            data-scroll-reveal-delay="0.12"
          >
            <p className="hackathon-card-meta">{item.meta}</p>
            <h4 className="freelance-case-title">{item.title}</h4>
            <p className="freelance-case-client">{item.client}</p>
            <p className="freelance-case-description">{item.description}</p>
            <ul className="hackathon-card-points">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <ul className="project-tags">
              {item.tech.map((tech) => (
                <li key={tech} className="project-tag">
                  {tech}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Secondary, not primary: Contact's EMAIL ME follows right below and
          owns the one clay CTA on that screen. */}
      <div className="freelance-cta" data-scroll-reveal>
        <p>{t.freelanceCtaLead}</p>
        <a className="outline-button is-secondary" href={mailto}>
          {t.freelanceCta} ↗
        </a>
      </div>
    </section>
  );
}
