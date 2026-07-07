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
        <form className="contact-form">
          <AvailabilityPill className="inline-availability" />
          <h2>CONTACT</h2>
          <p className="lead">
            如果你是實習審查者、研究/設計團隊，或想了解我的作品，歡迎留下訊息。
          </p>
          <div className="form-split">
            <label>
              <span>Name</span>
              <input type="text" placeholder="" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" placeholder="" />
            </label>
          </div>
          <label>
            <span>Topic</span>
            <select defaultValue="">
              <option value="" disabled>
                Select...
              </option>
              <option>Internship</option>
              <option>Portfolio feedback</option>
              <option>Creative coding</option>
            </select>
          </label>
          <label>
            <span>Message</span>
            <textarea placeholder="" />
          </label>
          <button className="outline-button submit-button" type="button">
            SUBMIT
          </button>
        </form>
      </div>
    </section>
  );
}
