import { assets } from "../../data";
import { useMagnetic } from "../../hooks";
import { AvailabilityPill, HiBubble, MaskHeading } from "../ui";

export function Contact() {
  const magneticEmail = useMagnetic();
  const magneticGithub = useMagnetic();

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-grid">
        <div className="portrait-card contact-portrait">
          <img src={assets.portrait} alt="Portrait of portfolio creator" width={680} height={952} loading="lazy" />
          <HiBubble small />
        </div>
        <div className="contact-form contact-direct">
          <AvailabilityPill className="inline-availability" />
          <MaskHeading text="CONTACT" />
          <p className="lead">
            想看更多或聊聊互動專案，歡迎透過以下方式找我。
          </p>
          <div className="contact-direct-links">
            <a
              ref={magneticEmail}
              className="outline-button contact-direct-link"
              href="mailto:znye.6302@gmail.com"
            >
              EMAIL ME ↗
            </a>
            <a
              ref={magneticGithub}
              className="outline-button contact-direct-link"
              href="https://github.com/zn6302"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
