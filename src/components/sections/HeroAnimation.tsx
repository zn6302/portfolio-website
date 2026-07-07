export function HeroAnimation() {
  return (
    <section className="hero-animation" aria-label="Intro animation">
      <video
        className="hero-animation-video"
        src="/hero/hero-animation.mp4"
        poster="/hero/hero-animation-poster.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </section>
  );
}
