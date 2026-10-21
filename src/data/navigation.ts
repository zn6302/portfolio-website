export interface NavItem {
  label: string;
  /** In-page anchor; useAnchorScroll handles the scroll and moves focus there. */
  href: string;
}

// Work comes first on purpose: it's what reviewers open the site for. There is
// no "Home" item — the avatar at the start of the nav links back to the top.
// Contact is rendered separately as the last, filled pill.
export const navItems: NavItem[] = [
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#sketches" },
];
