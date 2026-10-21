import { useCallback, useEffect, useRef, useState } from "react";
import { localePath, stripLocale } from "../data";
import { useLocale } from "./useLocale";

const PROJECT_PATH_PREFIX = "/projects/";

/** One value per page load, stamped on the history entries this load pushes.
 *  `history.state` survives a reload, but the home entry behind it then
 *  belongs to a page that no longer exists — stepping back to it would reload
 *  the site — so a stamp from an earlier load is treated like a deep link. */
const PAGE_LOAD_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

interface ProjectHistoryState {
  projectSlug: string;
  /** PAGE_LOAD_ID when this entry was pushed on top of the home page by a
   *  card click in this load; absent for a deep link. */
  fromHome?: string;
}

function currentProjectState(): ProjectHistoryState | null {
  const state = window.history.state as ProjectHistoryState | null;
  return state && typeof state === "object" && "projectSlug" in state ? state : null;
}

/** How long to wait for the popstate that `history.back()` should fire before
 *  closing the overlay directly anyway. */
const BACK_FALLBACK_MS = 600;

/** Extracts `<slug>` from `/projects/<slug>` or `/en/projects/<slug>`
 *  (trailing slash tolerant); null otherwise. */
function slugFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const pathname = stripLocale(window.location.pathname);
  if (!pathname.startsWith(PROJECT_PATH_PREFIX)) return null;
  const slug = pathname.slice(PROJECT_PATH_PREFIX.length).replace(/\/+$/, "");
  return slug.length > 0 ? slug : null;
}

interface UseProjectRoute {
  /** Slug the address bar currently points at (or null on "/"). Drives which
   *  project overlay is open — set on mount from the URL, and kept in sync
   *  with browser back/forward via `popstate`. */
  activeSlug: string | null;
  /** Push `/projects/<slug>` and open it. Call from a project-card click. */
  openProject: (slug: string) => void;
  /** Return to the locale's home (`/` or `/en`) and close the overlay. Call
   *  from the overlay's close button/ESC/backdrop-click handler. Opened from
   *  the home page: steps back in history, so a later Back leaves the site
   *  instead of reopening the project. Deep link: replaces the entry with
   *  home (there is nothing of ours to step back to). */
  closeProject: () => void;
  /** Swap the open project in place (the overlay's prev/next strip) without
   *  growing back-button history — uses `replaceState`, not `pushState`, so
   *  a single "back" press from anywhere in a prev/next crawl still lands on
   *  "/" instead of stepping back through every project visited. */
  replaceProject: (slug: string) => void;
}

/**
 * Syncs the project detail overlay with the URL via the native History API
 * (no react-router, per project constraints). `/projects/<slug>` opens the
 * matching overlay — on click, on a direct deep-link page load, and on
 * browser back/forward — so the address bar and the on-screen overlay never
 * disagree, and the back button closes the overlay instead of leaving the
 * site.
 */
export function useProjectRoute(): UseProjectRoute {
  // Paths stay inside the current locale: on the English site a card opens
  // `/en/projects/<slug>` and closing returns to `/en`.
  const { locale } = useLocale();
  const [activeSlug, setActiveSlug] = useState<string | null>(slugFromLocation);
  // Set while a close is waiting for its `history.back()` to land, so a second
  // ESC / click in that gap can't step back a second time (off the site).
  const pendingBackRef = useRef<number | null>(null);

  // Browser back/forward (and our own close, below): the URL has already
  // changed by the time this fires, so just mirror it.
  useEffect(() => {
    const clearPendingBack = () => {
      if (pendingBackRef.current !== null) window.clearTimeout(pendingBackRef.current);
      pendingBackRef.current = null;
    };
    const onPopState = () => {
      clearPendingBack();
      setActiveSlug(slugFromLocation());
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      clearPendingBack();
    };
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      const path = localePath(`${PROJECT_PATH_PREFIX}${slug}`, locale);
      if (window.location.pathname !== path) {
        const state: ProjectHistoryState = { projectSlug: slug, fromHome: PAGE_LOAD_ID };
        window.history.pushState(state, "", path);
      }
      setActiveSlug(slug);
    },
    [locale],
  );

  const closeProject = useCallback(() => {
    if (pendingBackRef.current !== null) return;
    const home = localePath("/", locale);
    const closeInPlace = () => {
      if (window.location.pathname !== home) {
        window.history.replaceState(null, "", home);
      }
      setActiveSlug(null);
    };
    if (currentProjectState()?.fromHome === PAGE_LOAD_ID) {
      // Undo our own pushState: the popstate handler above clears the slug,
      // which plays the overlay's exit animation as before. The timer is only
      // a safety net if the browser never delivers that popstate.
      pendingBackRef.current = window.setTimeout(() => {
        pendingBackRef.current = null;
        closeInPlace();
      }, BACK_FALLBACK_MS);
      window.history.back();
      return;
    }
    closeInPlace();
  }, [locale]);

  const replaceProject = useCallback(
    (slug: string) => {
      const path = localePath(`${PROJECT_PATH_PREFIX}${slug}`, locale);
      if (window.location.pathname !== path) {
        // Keep `fromHome`, so closing after a prev/next walk still steps back
        // to the page the first project was opened from.
        const state: ProjectHistoryState = { projectSlug: slug, fromHome: currentProjectState()?.fromHome };
        window.history.replaceState(state, "", path);
      }
      setActiveSlug(slug);
    },
    [locale],
  );

  return { activeSlug, openProject, closeProject, replaceProject };
}
