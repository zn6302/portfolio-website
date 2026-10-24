import type { Locale } from "../types";

// URL scheme: the Chinese site is the root (`/`, `/projects/<slug>`) and the
// English site mirrors it under `/en` (`/en`, `/en/projects/<slug>`). Every
// page is a real prerendered file (scripts/prerender.mjs), so the language is
// always readable from the path alone — the app, the prerender step and the
// Cloudflare Worker (worker/index.ts) all share these helpers.

export const LOCALES: Locale[] = ["zh", "en"];

/** `<html lang>` / hreflang value per locale. */
export const HTML_LANG: Record<Locale, string> = { zh: "zh-Hant", en: "en" };

/** og:locale value per locale. */
export const OG_LOCALE: Record<Locale, string> = { zh: "zh_TW", en: "en_US" };

/** Cookie written by the language toggle. Once set it overrides the
 *  country-based default applied by worker/index.ts. */
export const LOCALE_COOKIE = "lang";

const PREFIX: Record<Locale, string> = { zh: "", en: "/en" };

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

/** Drops the locale prefix: `/en/projects/x` → `/projects/x`, `/en` → `/`. */
export function stripLocale(pathname: string): string {
  if (localeFromPath(pathname) === "zh") return pathname;
  return pathname.slice(PREFIX.en.length) || "/";
}

/** Locale-neutral path → that locale's path: `/` → `/en`, `/projects/x` → `/en/projects/x`. */
export function localePath(path: string, locale: Locale): string {
  const prefix = PREFIX[locale];
  if (!prefix) return path;
  return path === "/" ? prefix : `${prefix}${path}`;
}
