export function Socials({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`socials ${compact ? "compact" : ""}`} aria-label="Social links">
      <a href="https://x.com/home" aria-label="X">
        X
      </a>
      <a href="https://www.instagram.com/" aria-label="Instagram">
        ◎
      </a>
      <a href="https://www.behance.net/" aria-label="Behance">
        Bē
      </a>
      <a href="https://dribbble.com/" aria-label="Dribbble">
        ◒
      </a>
    </div>
  );
}
