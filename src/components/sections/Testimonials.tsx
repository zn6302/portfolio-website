import { testimonials } from "../../data";
import { useCountUp } from "../../hooks";
import { AvailabilityPill, StarRow } from "../ui";

export function Testimonials() {
  const satisfaction = useCountUp(98);
  const growth = useCountUp(200);

  return (
    <section className="section testimonials">
      <div className="section-head">
        <AvailabilityPill className="inline-availability" />
        <h2>WHAT MY CLIENTS SAY</h2>
        <p className="lead">
          Here’s what my clients have shared about their experiences working with me. Their trust and satisfaction
          motivate me to continue delivering designs that make an impact.
        </p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item, index) =>
          "metric" in item ? (
            <article className={`metric-card ${item.tone}`} key={item.label}>
              <p>{item.intro}</p>
              <strong>{item.label === "Growth" ? growth : satisfaction}%</strong>
              <span>{item.label}</span>
            </article>
          ) : (
            <article className="testimonial-card" key={`${item.name}-${index}`}>
              <StarRow />
              <p>{item.quote}</p>
              <div className="reviewer">
                <img src={item.avatar} alt={`${item.name} avatar`} />
                <div>
                  <b>{item.name}</b>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
