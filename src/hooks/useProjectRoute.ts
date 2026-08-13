import { useCallback, useEffect, useState } from "react";

const PROJECT_PATH_PREFIX = "/projects/";

/** Extracts `<slug>` from `/projects/<slug>` (trailing slash tolerant); null otherwise. */
function slugFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const { pathname } = window.location;
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
  /** Push `/` and close the overlay. Call from the overlay's close
   *  button/ESC/backdrop-click handler. */
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
  const [activeSlug, setActiveSlug] = useState<string | null>(slugFromLocation);

  // Browser back/forward: the URL has already changed by the time this
  // fires, so just mirror it — no pushState/replaceState here.
  useEffect(() => {
    const onPopState = () => setActiveSlug(slugFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProject = useCallback((slug: string) => {
    const path = `${PROJECT_PATH_PREFIX}${slug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ projectSlug: slug }, "", path);
    }
    setActiveSlug(slug);
  }, []);

  const closeProject = useCallback(() => {
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    setActiveSlug(null);
  }, []);

  const replaceProject = useCallback((slug: string) => {
    const path = `${PROJECT_PATH_PREFIX}${slug}`;
    if (window.location.pathname !== path) {
      window.history.replaceState({ projectSlug: slug }, "", path);
    }
    setActiveSlug(slug);
  }, []);

  return { activeSlug, openProject, closeProject, replaceProject };
}
