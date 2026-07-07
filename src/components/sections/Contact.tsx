import { assets } from "../../data";
import { AvailabilityPill, HiBubble } from "../ui";

export function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-grid">
        <div className="portrait-card contact-portrait">
          <img src={assets.portrait} alt="Portrait of portfolio creator" />
          <HiBubble small />
        </div>
        <div className="contact-form contact-direct">
          <AvailabilityPill className="inline-availability" />
          <h2>CONTACT</h2>
          <p className="lead">
            如果你是實習審查者、研究/設計團隊，或想了解我的作品，歡迎直接聯絡我。
          </p>
          <div className="contact-direct-links">
            <a
              className="outline-button contact-direct-link"
              href="mailto:vivian20021213@gmail.com"
            >
              EMAIL ME ↗
            </a>
            <a
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
