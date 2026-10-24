import { assets } from "../../data";
import { useLocale, useMagnetic } from "../../hooks";
import { HiBubble, MaskHeading } from "../ui";

export function Contact() {
  const magneticEmail = useMagnetic();
  const magneticGithub = useMagnetic();
  const { t } = useLocale();

  return (
    <section className="section contact-section" id="contact" aria-label={t.contactLabel}>
      {/* Text first, on the shared column edge like every other section; the
          portrait sits in the right track (≥1081) or below the text (≤1080),
          so the Hi bubble never hangs over the heading. */}
      <div className="contact-grid">
        <div className="contact-form contact-direct">
          <span className="section-eyebrow" aria-hidden="true">07 / 07</span>
          <MaskHeading text="CONTACT" />
          {/* Reveal the content under the heading; the heading has its own mask. */}
          <div className="contact-direct-body" data-scroll-reveal data-scroll-reveal-delay="0.12">
            <p className="lead">{t.contactLead}</p>
            {/* The address itself is the display line. <wbr> lets it break
                after the @ instead of overflowing on narrow phones. */}
            <p className="contact-email">
              <a href="mailto:znye.6302@gmail.com">
                znye.6302@<wbr />gmail.com
              </a>
            </p>
            <div className="contact-direct-links">
              <a
                ref={magneticEmail}
                className="outline-button is-primary contact-direct-link"
                href="mailto:znye.6302@gmail.com"
              >
                {t.ctaEmail} ↗
              </a>
              <a
                ref={magneticGithub}
                className="outline-button is-secondary contact-direct-link"
                href="https://github.com/zn6302"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ctaGithub} ↗
              </a>
            </div>
          </div>
        </div>
        <div className="portrait-card contact-portrait" data-scroll-reveal>
          <img src={assets.portrait} alt={t.portraitAlt} width={680} height={952} loading="lazy" />
          <HiBubble small />
        </div>
      </div>
    </section>
  );
}
