import { hackathons } from "../../data";
import { useLocale } from "../../hooks";
import { MaskHeading } from "../ui";

export function Hackathons() {
  const { locale, t } = useLocale();

  return (
    <section className="section hackathons-section" id="hackathons" aria-label={t.hackathonsLabel}>
      <div className="section-head">
        <span className="section-eyebrow" aria-hidden="true">04 / 07</span>
        <MaskHeading text="HACKATHON" />
        {/* Reveal the lead only; the heading has its own mask reveal. */}
        <p className="lead" data-scroll-reveal data-scroll-reveal-delay="0.12">
          {t.hackathonsLead}
        </p>
      </div>

      {hackathons[locale].map((item) => (
        <article
          key={item.slug}
          className="hackathon-card"
          data-scroll-reveal
          data-scroll-reveal-delay="0.16"
        >
          <div className="hackathon-card-media">
            <img src={item.image} alt={item.alt} width={1180} height={597} loading="lazy" />
          </div>
          <div className="hackathon-card-body">
            <p className="hackathon-card-meta">{item.meta}</p>
            <h3 className="hackathon-card-title">{item.title}</h3>
            <p className="hackathon-card-description">{item.description}</p>
            <p className="hackathon-card-role">{item.role}</p>
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
            <div className="sketch-card-links hackathon-card-links">
              {item.liveUrl && (
                <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                  PLAY LIVE ↗
                </a>
              )}
              {item.githubUrl && (
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                  GITHUB ↗
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
