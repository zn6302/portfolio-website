export function Socials({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`socials ${compact ? "compact" : ""}`} aria-label="Social links">
      <a
        href="https://github.com/zn6302"
        aria-label="GitHub"
        target="_blank"
        rel="noopener noreferrer"
      >
        GH
      </a>
    </div>
  );
}
