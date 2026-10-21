import type { MouseEvent } from "react";
import { HTML_LANG, LOCALE_COOKIE, localePath, stripLocale } from "../../data";
import { useLocale } from "../../hooks";
import type { Locale } from "../../types";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Same page in the other locale. Read at click time, not render time: the
 *  project overlay changes the path with pushState without re-rendering this. */
function otherLocaleUrl(target: Locale) {
  const { pathname, search } = window.location;
  return `${localePath(stripLocale(pathname), target)}${search}`;
}

/**
 * 中 / EN switch. A real link to the same page in the other language, so it
 * also works as a crawlable alternate. Clicking it stores the choice in the
 * `lang` cookie, which worker/index.ts honours over the country-based
 * default — otherwise a visitor outside Taiwan who picks 中文 would be sent
 * straight back to /en.
 */
export function LangToggle({ className = "" }: { className?: string }) {
  const { locale, t } = useLocale();
  const target: Locale = locale === "zh" ? "en" : "zh";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
    // Modified clicks (new tab/window) keep their native behaviour.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.assign(otherLocaleUrl(target));
  };

  return (
    <a
      className={`lang-toggle ${className}`}
      href={localePath(stripLocale(window.location.pathname), target)}
      hrefLang={HTML_LANG[target]}
      lang={HTML_LANG[target]}
      aria-label={t.switchLanguage}
      onClick={handleClick}
    >
      <span className={locale === "zh" ? "is-active" : ""} aria-hidden="true">
        中
      </span>
      <span className={locale === "en" ? "is-active" : ""} aria-hidden="true">
        EN
      </span>
    </a>
  );
}
