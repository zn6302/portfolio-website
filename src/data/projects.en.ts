import type { ProjectCopy } from "../types";

// English copy for projects.ts, keyed by project id. Only text lives here —
// media, tech and links are inherited from the zh entry.
//
// Highlights follow the same "headline + separator + explanation" shape as
// the zh data: the overlay bolds everything before the first ": " (see
// splitHighlight in ProjectOverlay.tsx), so a highlight without a headline
// must not contain ": " at all.
export const projectCopyEn: Record<string, ProjectCopy> = {
  "all-things-scored": {
    category: "INTERACTIVE / CREATIVE CODING",
    title: "All Things Scored",
    description:
      "A line runs across the video. Anything that crosses it (a person walking past, a cat jumping onto a table) plays a note: where it crosses sets the pitch, and bigger movements hit harder.",
    subtitle: "A browser instrument played by motion",
    // \u00a0 keeps each item whole, so a narrow card wraps only at a " · ".
    outcome: "Solo\u00a0project · steady\u00a060fps · playable\u00a0online",
    role: "Solo developer",
    overview:
      "I split it into three parts that all run live in the browser: computer vision catches anything crossing the line, Web Audio turns each crossing into sound, and a scale mapping picks the note. The playable version is on GitHub Pages, and the code is public.",
    highlights: [
      "Scans one line only: an adaptive background model (an EMA with learning rates of 0.01 when triggered and 0.06 otherwise) samples just the one scanline along the trigger line, and the piece runs at a steady 60fps",
      "Never off-key: position sets pitch and intensity sets velocity, and every pitch snaps to the scale, so nothing lands between notes",
      "Bursts don't clip: notes play on a Tone.js PolySynth through an effects chain, with Transport beat quantization (@8n/@16n), and each of 20 segments has a cooldown that throttles voices",
      "Refs in the rAF loop: the high-frequency loop syncs state through refs, which avoids stale closures",
    ],
  },
  "openhci-2026": {
    category: "SHIPPED / FRONTEND",
    title: "OpenHCI 2026 Official Website",
    description:
      "The design team gave the site a glitchy, pixelated look, and I led the interactive animation to match: text unscrambles into place, and a pixel-art loader holds the page until the fonts have loaded.",
    subtitle: "An event site themed \"(AI)dentity\"",
    outcome: "Live · 2026.openhci.com · team PR workflow",
    role: "Frontend engineer: UI components, design-system maintenance, interactive animation lead",
    overview:
      "The theme, \"(AI)dentity\", is about how identity glitches, gets decoded and gets put back together in the age of AI, and the design team's pixel-and-glitch look comes straight from it. We built the site from scratch from their Figma files, with several people sending pull requests to a repo in a shared GitHub organization.",
    highlights: [
      "Scramble text as components: use-scramble is wrapped in two design-system components, ScrollScramble and LoopingShockScramble; an IntersectionObserver starts each one when it scrolls into view and unobserves it after it plays once",
      "A loader with two gates: the pixel-art GlobalLoader stays up for at least 2.5s and waits for document.fonts.ready, so text never flashes in a fallback font (FOUT)",
      "Fully static: a Next.js 15 static export (SSG) served from GitHub Pages, with DNS on Cloudflare",
    ],
  },
  "click-or-check": {
    category: "INTERACTIVE / GAME",
    title: "Click or Check?",
    description:
      "You're the news editor, and before you hit \"Share\" on a story, you decide whether to check it. Checking costs time; a sensational headline buys traffic but can cost credibility.",
    subtitle: "A news game about trading traffic against credibility",
    outcome: "Media-literacy game · playable online · code on GitHub",
    role: "Frontend developer",
    overview:
      "Whether it pays to check a story before you share it depends on how sensational its headline is and whether it's true. It's a React 19 and Vite app, hosted on Vercel.",
    highlights: [
      "No leaked timers: fact-checking runs as a timed state machine (verifying → result → fading → removed), and a single cardTimersRef clears every timer, so nothing calls setState after unmount and nothing leaks memory",
      "Scored on a 2D grid: one axis is how sensational the headline is and the other is whether the story is true",
      "Drawn with plain CSS: the two-axis bar at the top is a linear-gradient computed from a formula and updated live, without a chart library",
    ],
  },
  mybot: {
    category: "AI AGENT / FULLSTACK",
    title: "myBot, a LINE Fitness Coach",
    imageAlt:
      "Flow diagram of myBot next to a real LINE chat: a meal photo goes in, the bot asks a follow-up question, the user replies, and calories and nutrients come back",
    description:
      "Send a photo of your meal on LINE. Gemini estimates the calories and nutrients, and the bot suggests your next meal from what's left of today's calorie budget.",
    subtitle: "AI meal logging from photos",
    outcome: "LINE bot · 8-layer intent routing · solo backend",
    role: "Solo backend developer",
    overview:
      "Logging food usually means opening an app, searching for each item and filling in a form; with myBot, you start by taking a photo. In the backend I put the LLM last, to keep cost and latency down and the replies more predictable: rules catch explicit commands, a formula works out daily calorie needs, and only photos, plus messages that need language understanding, go to the LLM.",
    highlights: [
      "Rules before Gemini: 8-layer intent routing runs cheap regex and keyword checks on explicit commands first, and only what gets past them reaches Gemini",
      "Asks about portion size: photo recognition takes two steps; the bot saves a pending_context with a TTL, asks a follow-up and ties the two LINE webhook calls (photo and reply) together, so Gemini's portion estimate is more accurate",
      "Cycle-aware replies: the menstrual cycle is split proportionally into four phases, and the phase goes into the system prompts of three LLMs (coach, cravings, strength training)",
      "TDEE by formula: calculated with the Mifflin-St Jeor equation instead of estimated by the LLM, so the same inputs always give the same number",
    ],
  },
  smiley: {
    category: "CAPSTONE / PRODUCT",
    title: "SMILEY Emotion Journal",
    description:
      "SMILEY is a journal that writes back. Finish an entry and the app picks out its main emotion, then answers with a color, a song and an essential oil.",
    subtitle: "A journal app that reads emotion with BERT",
    imageAlt:
      "SMILEY's home screen, an illustrated room with a character beside a diary, surrounded by phone screens recommending a plant, an essential oil and music",
    outcome: "Capstone · team lead · 85–93% precision/recall",
    role: "Team lead: architecture, from UI flow to business model",
    overview:
      "SMILEY was our team's capstone; I led the team and oversaw the architecture. We'd noticed that many people can't put their feelings into words, even to themselves, so the app only asks you to write and leaves reading the emotion to BERT. It was my first time taking a product all the way from pain point to model to UI flow to business model.",
    highlights: [
      "Sorts entries into six emotions: a BERT classifier trained and tested on about 1.7 million NTCIR-14 samples (one fixed split, three runs) reached 85–93% precision/recall",
      "Chat feedback runs locally: TaiwanLLM on Ollama, with a four-part rubric we wrote to score the quality of its replies",
      "Two databases, split by job: Firebase handles auth and MySQL stores the app's data, behind a Flutter frontend with five modules",
      "Suggestions for each emotion: whatever BERT detects, the app recommends music, essential oils and potted plants chosen for what their flowers symbolize",
    ],
  },
};
