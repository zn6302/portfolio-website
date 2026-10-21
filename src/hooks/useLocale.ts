import { localeFromPath, ui } from "../data";
import type { Locale } from "../types";

// The locale is fixed for a page load: it comes from the URL prefix (`/en/…`),
// and the language toggle navigates to the other locale's URL instead of
// re-rendering in place. That keeps the per-language <head> (prerendered by
// scripts/prerender.mjs) correct, and every GSAP layout that measures text
// (pins, the skills graph, the hero card slots) is built against the right
// copy from the first frame.
const locale: Locale = typeof window === "undefined" ? "zh" : localeFromPath(window.location.pathname);

export function useLocale() {
  return { locale, t: ui[locale] };
}
