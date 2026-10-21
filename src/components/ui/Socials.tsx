import { useLocale } from "../../hooks";

export function Socials() {
  const { t } = useLocale();

  return (
    <div className="socials" role="group" aria-label={t.socialLinksLabel}>
      <a href="https://github.com/zn6302" target="_blank" rel="noopener noreferrer">
        {t.githubLabel}
        <span className="socials-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </div>
  );
}
