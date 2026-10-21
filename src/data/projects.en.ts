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
      "Motion is an unheard melody. Everything that moves is playing music we can't hear — so I drew a line, and any movement that crosses it is translated into notes.",
    subtitle: "motion becomes music — an unheard melody",
    outcome: "Live video → music · steady 60fps · solo project",
    role: "Solo developer",
    overview:
      "Everything that moves is playing music we just can't hear — this piece draws a single line and translates whatever crosses it into melody. Computer vision (background subtraction), Web Audio DSP (a Tone.js effects chain with beat quantization) and music theory (scale mapping): three fields playing on the same line.",
    highlights: [
      "Adaptive background model: an EMA with dual learning rates (0.01 when triggered, 0.06 otherwise) that reads only one scanline on the trigger line plus samples, holding a steady 60fps",
      "Never off-key: position sets pitch and intensity sets velocity, mapped onto a musical scale rather than continuous frequency",
      "Tone.js PolySynth effects chain with Transport beat quantization (@8n/@16n), plus per-zone cooldowns across 20 segments for voice throttling so bursts never distort",
      "Refs, not state, in the rAF loop: the high-frequency loop syncs state through refs to avoid stale closures — the right way to write a React animation loop",
    ],
  },
  "openhci-2026": {
    category: "SHIPPED / FRONTEND",
    title: "OpenHCI 2026 Official Website",
    description:
      "The design told a story of glitches and pixels; the code finishes it through animation. Not just a faithful build of the mockups — every decode and entrance carries the world of \"(AI)dentity\" forward.",
    subtitle: "(AI)dentity — design and code telling one story",
    outcome: "Live · 2026.openhci.com · multi-contributor PR workflow",
    role: "Frontend engineer: UI components, design-system upkeep, lead on interactive animation",
    overview:
      "The design team told the story of \"(AI)dentity\" through glitches and pixels; my job was to let the code finish telling it. Built from scratch off Figma with a multi-person PR workflow in a GitHub Organization, and live at 2026.openhci.com — a good event site is not a photocopier for mockups.",
    highlights: [
      "Scramble text as design-system components: use-scramble wrapped into ScrollScramble / LoopingShockScramble, triggered when IntersectionObserver sees them enter and unobserved after a single play",
      "Pixel-art GlobalLoader with dual gating: a 2.5s minimum display plus document.fonts.ready, preventing FOUT while keeping the sense of ceremony",
      "Zero-ops hosting: Next.js 15 static export to GitHub Pages behind Cloudflare DNS, with no servers to maintain",
    ],
  },
  "click-or-check": {
    category: "INTERACTIVE / GAME",
    title: "Click or Check?",
    description:
      "Media ethics feels abstract — until you're the one who has to hit \"Share\". Every story is a tug-of-war between traffic and credibility, and a choice you make yourself sticks longer than any answer you're told.",
    subtitle: "Traffic vs. credibility — media ethics you can play",
    outcome: "Two-axis scoring system · data viz with zero chart libraries",
    role: "Solo developer",
    overview:
      "Everyone says \"verify before you share\", but few have felt how hard that is — this game translates media ethics into trade-offs you have to make yourself. You take a news editor's seat, where fact-checking costs time, sensational headlines buy traffic and trust drains away, and the scoring table itself is the lesson.",
    highlights: [
      "Fact-checking runs as a full timeline state machine (verifying → result → fading → removed), with every timer cleaned up through one cardTimersRef, so there is no setState after unmount and no memory leak",
      "Scoring as instructional design: a two-dimensional matrix of headline sensationalism × story truthfulness, where the numbers themselves teach media ethics",
      "Live data viz with zero chart libraries: the two-axis bar at the top is a CSS linear-gradient computed with plain math",
    ],
  },
  mybot: {
    category: "AI AGENT / FULLSTACK",
    title: "myBot Fitness Coach LINE Bot",
    description:
      "Turning the hard work of staying healthy into the small act of taking a photo. What body management usually lacks isn't knowledge — it's an entry point simple enough to use every day.",
    subtitle: "An on-call AI fitness coach — making a hard thing small",
    outcome: "LINE Bot · eight-layer intent routing · backend built solo",
    role: "Solo developer (entire backend)",
    overview:
      "Body management never fails for lack of knowledge — it fails because logging is a chore. So I translated it into one tiny action: take a photo. A gentle experience on top, cool-headed engineering trade-offs underneath: rules catch explicit commands, a scientific formula computes calories, and only language understanding is left to the LLM. The key to an AI product isn't using AI everywhere — it's knowing where not to.",
    highlights: [
      "Eight-layer intent routing: cheap regex and keyword checks catch explicit commands first, and only what gets through reaches Gemini — a trade-off between cost, latency and predictability",
      "Two-step photo recognition with TTL storage: a pending_context is saved while the bot asks a follow-up, linking two independent LINE webhooks to fix inaccurate multimodal portion estimates",
      "Menstrual-cycle context injection: four phases computed proportionally and injected into the system prompts of three LLMs (coach, cravings, strength training)",
      "TDEE from the Mifflin-St Jeor equation, not an LLM's guess: trustworthy, explainable, zero hallucination",
    ],
  },
  smiley: {
    category: "CAPSTONE / PRODUCT",
    title: "SMILEY Emotion Journal",
    description:
      "Healing begins with feeling. SMILEY translates the emotions you can't put into words in your journal into color, music and scent, so awareness can arrive on its own, without being forced.",
    subtitle: "Healing begins with feeling",
    outcome: "Capstone team lead · BERT six-class 85–93%",
    role: "Team lead: architecture, from UI flow to business model",
    overview:
      "Many people do have feelings — they just can't say them out loud. SMILEY translates the emotions in a journal into color, music and scent, so awareness happens naturally: once BERT reads the dominant emotion, the app answers you in another language. It was my first time taking a product all the way from pain point and model to UI flow and business model.",
    highlights: [
      "Six-class BERT emotion model: about 1.7 million NTCIR-14 samples on a fixed split, run three times, with 85–93% precision/recall",
      "Locally deployed chat feedback with TaiwanLLM + Ollama, checked by a self-built four-dimension quantitative rubric for LLM quality",
      "Flutter frontend with five core modules, backed by two databases — Firebase for auth and MySQL for business data",
      "\"Multisensory healing\", made real: potted-plant flower language, music and essential-oil recommendations keep concept and interaction consistent",
    ],
  },
};
