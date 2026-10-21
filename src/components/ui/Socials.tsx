import { useLocale } from "../../hooks";

export function Socials({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();

  return (
    <div className={`socials ${compact ? "compact" : ""}`} role="group" aria-label={t.socialLinksLabel}>
      <a href="https://github.com/zn6302" target="_blank" rel="noopener noreferrer">
        {t.githubLabel}
        <span className="socials-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </div>
  );
}
