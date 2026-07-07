import { insights } from "../../data";
import { AvailabilityPill } from "../ui";

export function Insights() {
  return (
    <section className="section insights" id="blogs">
      <div className="section-head">
        <AvailabilityPill className="inline-availability" />
        <h2>DESIGN INSIGHTS & IDEAS</h2>
        <p className="lead">
          From design trends to creative processes, these articles offer insights to help you elevate your craft, solve
          challenges, and spark new ideas for your projects.
        </p>
      </div>
      <div className="blog-grid">
        {insights.map((post) => (
          <article className="blog-card" key={post.title}>
            <img src={post.image} alt={`${post.title} cover`} />
            <div className="blog-meta">
              <span>{post.category}</span>
              <time>{post.date}</time>
            </div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </article>
        ))}
      </div>
      <a className="outline-button wide centered" href="#blogs">
        BROWSE ALL INSIGHTS
      </a>
    </section>
  );
}
