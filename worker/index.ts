/**
 * Country-based language default, plus host-based robots.txt.
 *
 * Runs only for `/`, `/projects/*` and `/robots.txt` (see
 * `run_worker_first` in wrangler.jsonc); every other request, including all
 * of /en and every other asset, is served straight from dist/ without
 * invoking this script.
 *
 * A first-time visitor outside the Chinese-reading regions gets a 302 to the
 * same page under /en. Explicit choices always win: the language toggle
 * writes the `lang` cookie (LangToggle.tsx), and an /en URL is never
 * redirected back. Crawlers and link-preview fetchers are never redirected,
 * so search engines (Googlebot crawls from US IPs) and shared-link cards
 * index each URL in its own language; hreflang tells them about the twin.
 *
 * /robots.txt also comes through here: dist/ always holds the indexable
 * production file, and every other hostname (dev.znye6302.com, workers.dev,
 * previews — same build, duplicate content) gets a blanket Disallow instead.
 */
import { LOCALE_COOKIE, localePath } from "../src/data/locale";

/** The only hostname search engines should index. */
const PRODUCTION_HOST = "znye6302.com";

/** Visitors from these countries keep the Chinese site by default. */
const ZH_COUNTRIES = new Set(["TW", "HK", "MO", "CN"]);

const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|embedly|whatsapp|preview|lighthouse|headless/i;

/** zh pages with an English twin: `/` and `/projects/<slug>`. Project media
 *  (covers, demo videos) lives under /projects/ too, so it also reaches this
 *  Worker via run_worker_first — slugs never contain a dot and media files
 *  always do, and they must pass through untouched. */
const ZH_PAGE = /^\/(?:projects\/[^/.]+\/?)?$/;

const COOKIE_PATTERN = new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=(zh|en)(?:;|$)`);

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

type CfRequest = Request & { cf?: { country?: string } };

function prefersEnglish(request: CfRequest): boolean {
  const chosen = request.headers.get("Cookie")?.match(COOKIE_PATTERN)?.[1];
  if (chosen) return chosen === "en";
  if (BOT_UA.test(request.headers.get("User-Agent") ?? "")) return false;
  const country = request.cf?.country;
  return !!country && !ZH_COUNTRIES.has(country);
}

export default {
  async fetch(request: CfRequest, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt" && url.hostname !== PRODUCTION_HOST) {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const isPageRead = request.method === "GET" || request.method === "HEAD";

    if (isPageRead && ZH_PAGE.test(url.pathname) && prefersEnglish(request)) {
      url.pathname = localePath(url.pathname.replace(/\/+$/, "") || "/", "en");
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
          // Depends on cookie + country: never let a shared cache store it.
          "Cache-Control": "private, no-store",
          Vary: "Cookie",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
