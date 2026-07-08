export const assets = {
  // Tight square face crop (from public/thisME.JPG) for the small circular nav
  // avatar / availability pill — the full uncropped photo left too much blank
  // studio background at that size.
  avatar: "/hero/avatar.jpg",
  // Reuses the bust crop made for the services card (same aspect ratio as the
  // contact card slot) instead of the raw uncropped photo.
  portrait: "/hero/services-portrait.jpg",
  // Back face of the Skills card flip. Reuses the hero keyframe illustration
  // (site's own visual language) instead of an external Framer template image.
  portraitBack: "/hero/about-keyframe.webp",
  // Keyframe grabbed from the hero mp4 (public/hero/hero-animation.mp4 @ 0.2s),
  // cropped to a bust portrait so the About card matches the hero illustration
  // instead of the unrelated stock headshot.
  aboutKeyframe: "/hero/about-keyframe.webp",
  // User photo (public/thisME.JPG), cropped to a bust portrait. Used for the
  // Skills card; `portrait` above reuses this same file for the contact card
  // since both slots share the same aspect ratio.
  servicesPortrait: "/hero/services-portrait.jpg",
};
