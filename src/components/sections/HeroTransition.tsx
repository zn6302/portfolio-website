import { useRef } from "react";
import { HeroIntro } from "./HeroIntro";
import { HeroProfile } from "./HeroProfile";

/**
 * Markup-only hero shell. It provides the scroll length (`.hero-transition` is
 * tall), the pinned text layers (intro fades out, profile fades in) and the
 * empty `.profile-card-slot` landing target.
 *
 * The actual moving card — the mp4 that shrinks and then rotates on through the
 * Services/About sections — is a single element owned by HeroCardJourney, which
 * drives these text layers by querying `.hero-intro` / `.hero-profile`. Keeping
 * the card in one place is what makes the whole sequence one continuous card
 * instead of two separate ones.
 */
export function HeroTransition() {
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <section className="hero-transition">
      <div className="hero-sticky">
        <HeroIntro />
        <HeroProfile slotRef={slotRef} />
      </div>
    </section>
  );
}
