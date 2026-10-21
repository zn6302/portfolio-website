import type { MouseEvent } from "react";
import { HTML_LANG, LOCALE_COOKIE, localePath, stripLocale } from "../../data";
import { useLocale } from "../../hooks";
import type { Locale } from "../../types";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Home sections a reader can be "in", in page order. */
const PLACE_IDS = ["skills", "about", "projects", "sketches", "contact"];

/** `#id` of the section under the viewport centre — the last one whose top
 *  has passed it, so the gap under a pin or the footer still counts as the
 *  section above. Empty while the hero fills the centre. */
function placeHash() {
  const centre = window.innerHeight / 2;
  let hash = "";
  for (const id of PLACE_IDS) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= centre) hash = `#${id}`;
  }
  return hash;
}

/** Same page in the other locale. Read at click time, not render time: the
 *  project overlay changes the path with pushState without re-rendering this.
 *  On the home page it also carries the reader's place as a hash, which
 *  useAnchorScroll lands on after the pins are built. */
function otherLocaleUrl(target: Locale) {
  const { pathname, search } = window.location;
  const path = stripLocale(pathname);
  return `${localePath(path, target)}${search}${path === "/" ? placeHash() : ""}`;
}

/**
 * 中 / EN switch. A real link to the same page in the other language, so it
 * also works as a crawlable alternate. Clicking it stores the choice in the
 * `lang` cookie, which worker/index.ts honours over the country-based
 * default — otherwise a visitor outside Taiwan who picks 中文 would be sent
 * straight back to /en. A plain click keeps the reader's place (otherLocaleUrl);
 * the href itself stays hash-free so crawlers see a clean alternate.
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
