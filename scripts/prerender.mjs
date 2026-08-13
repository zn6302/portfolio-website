/**
 * Post-build static prerender step — see task brief / CLAUDE.md §"作品獨立 URL".
 *
 * `vite build` (which runs before this script, see package.json `build`)
 * outputs a single `dist/index.html` SPA shell — every route, including
 * `/projects/<slug>`, resolves to the exact same empty `<div id="root">`
 * until client JS runs. That's invisible to crawlers that don't execute JS,
 * and even for ones that do, the 5 project case studies (title, tech,
 * highlights, overview…) only ever existed inside a client-side overlay with
 * no dedicated URL — Google indexed the whole site as one page.
 *
 * This script fixes that after the fact, without touching the SPA build:
 * for each project in `src/data/projects.ts` it clones `dist/index.html`,
 * patches the <head> with that project's own title/description/canonical/
 * OG/Twitter tags + CreativeWork JSON-LD (copy sourced from
 * `src/data/seo.ts`), and pre-fills `<div id="root">` with real semantic
 * HTML (h1, highlights list, links…) describing the project. The page is
 * written to `dist/projects/<slug>/index.html`, a real static file Cloudflare
 * Workers static assets serves directly. React's `createRoot().render()`
 * still mounts on top and replaces this content on the client — visitors get
 * the normal SPA/overlay experience; crawlers (JS or no JS) get the real
 * content immediately.
 *
 * It also generates `dist/sitemap.xml` and `dist/robots.txt`.
 *
 * Data loading: `src/data/*.ts` use extensionless relative imports (project
 * convention, resolved by Vite/tsconfig's "bundler" moduleResolution) —
 * Node's native ESM loader can't resolve those directly even with type
 * stripping. Rather than rewrite the data files' import style just for this
 * script, we run a tiny in-process Vite SSR build (Vite is already a
 * devDependency; this adds no new dependency, runtime or otherwise) to bundle
 * `projects.ts` + `seo.ts` into two self-contained, plain-Node-importable ESM
 * files in a scratch temp dir, import them, then delete the temp dir.
 */
import { build } from "vite";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// ---------------------------------------------------------------------------
// 1. Load `projects.ts` + `seo.ts` as plain data, via a throwaway Vite build.
// ---------------------------------------------------------------------------
async function loadData() {
  const tmpOutDir = await fs.mkdtemp(path.join(os.tmpdir(), "znye-prerender-data-"));
  try {
    await build({
      root,
      configFile: false, // skip vite.config.ts's react()/tailwindcss() — irrelevant for a data-only bundle
      publicDir: false, // don't copy public/ into the scratch dir
      logLevel: "warn",
      build: {
        ssr: true,
        outDir: tmpOutDir,
        emptyOutDir: true,
        minify: false,
        target: "node22",
        rollupOptions: {
          input: {
            projects: path.join(root, "src/data/projects.ts"),
            seo: path.join(root, "src/data/seo.ts"),
          },
          output: { format: "es", entryFileNames: "[name].mjs" },
        },
      },
    });

    const [{ projects }, seo] = await Promise.all([
      import(pathToFileURL(path.join(tmpOutDir, "projects.mjs")).href),
      import(pathToFileURL(path.join(tmpOutDir, "seo.mjs")).href),
    ]);

    return { projects, seo };
  } finally {
    await fs.rm(tmpOutDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// 2. HTML escaping helpers for hand-built markup below.
// ---------------------------------------------------------------------------
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// 3. Semantic prerendered content for <div id="root">.
//
// Inline styles only (no stylesheet dependency, so it never flashes
// unstyled before JS/CSS load) using the CLAUDE.md color tokens' literal hex
// values directly — this file is outside the app's own styles.css/Tailwind
// pipeline on purpose, so no new colors are introduced, just the existing
// palette written as raw hex where a stylesheet class isn't available yet.
// React's createRoot().render() (src/main.tsx) clears and replaces all of
// this on mount; it exists purely for crawlers / no-JS clients.
// ---------------------------------------------------------------------------
const TOKENS = {
  paper: "#EBEDF3",
  cream: "#F8FAFC",
  ink: "#2D2121",
  inkSoft: "#5F686C",
  matchaDeep: "#3F6770",
  matcha: "#65959C",
  line: "#DDE4EA",
};

function renderProjectHtml(project) {
  const {
    title,
    category,
    subtitle,
    overview,
    role,
    tech,
    outcome,
    highlights,
    image,
    links,
  } = project;

  const cover = image
    ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)} 專案畫面" width="1200" height="675" style="width:100%;height:auto;display:block;border-radius:12px;border:2px solid ${TOKENS.ink};margin:0 0 24px;object-fit:cover;" />`
    : "";

  const metaCols = [];
  if (role) {
    metaCols.push(
      `<div><span style="display:block;font-family:'IBM Plex Mono',monospace;font-size:13px;color:${TOKENS.inkSoft};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">ROLE</span><p style="margin:0;">${escapeHtml(role)}</p></div>`,
    );
  }
  if (tech && tech.length > 0) {
    metaCols.push(
      `<div><span style="display:block;font-family:'IBM Plex Mono',monospace;font-size:13px;color:${TOKENS.inkSoft};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">STACK</span><p style="margin:0;">${tech.map(escapeHtml).join(" · ")}</p></div>`,
    );
  }
  const metaBlock =
    metaCols.length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:32px;margin:0 0 32px;">${metaCols.join("")}</div>`
      : "";

  const highlightsBlock =
    highlights && highlights.length > 0
      ? `<section style="margin:0 0 32px;">
      <h3 style="font-family:'IBM Plex Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:${TOKENS.inkSoft};margin:0 0 12px;">HIGHLIGHTS</h3>
      <ol style="padding-left:20px;margin:0;">
        ${highlights.map((h) => `<li style="margin-bottom:12px;">${escapeHtml(h)}</li>`).join("\n        ")}
      </ol>
    </section>`
      : "";

  const linkButtons = [];
  if (links?.live) {
    linkButtons.push(
      `<a href="${escapeAttr(links.live)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;border-radius:9999px;background:${TOKENS.matchaDeep};color:${TOKENS.cream};text-decoration:none;font-weight:500;">LIVE SITE ↗</a>`,
    );
  }
  if (links?.github) {
    linkButtons.push(
      `<a href="${escapeAttr(links.github)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;border-radius:9999px;background:transparent;border:1.5px solid ${TOKENS.matcha};color:${TOKENS.matchaDeep};text-decoration:none;font-weight:500;">GITHUB ↗</a>`,
    );
  }
  const linksBlock =
    linkButtons.length > 0
      ? `<p style="display:flex;gap:16px;flex-wrap:wrap;margin:0;">${linkButtons.join("")}</p>`
      : "";

  return `<div id="prerender" style="min-height:100vh;background:${TOKENS.paper};color:${TOKENS.ink};font-family:'Noto Sans TC',system-ui,-apple-system,sans-serif;line-height:1.7;">
  <main style="max-width:840px;margin:0 auto;padding:64px 24px 96px;">
    <a href="/" style="display:inline-block;margin-bottom:32px;color:${TOKENS.matchaDeep};text-decoration:none;font-weight:500;font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:0.04em;">&larr; BACK TO HOME</a>
    <p style="font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:0.08em;font-size:13px;color:${TOKENS.inkSoft};margin:0 0 8px;">${escapeHtml(category)}</p>
    <h1 style="font-size:39px;line-height:1.2;font-weight:900;margin:0 0 8px;">${escapeHtml(title)}</h1>
    ${subtitle ? `<h2 style="font-size:20px;line-height:1.4;font-weight:400;color:${TOKENS.inkSoft};margin:0 0 24px;">${escapeHtml(subtitle)}</h2>` : ""}
    ${cover}
    ${overview ? `<p style="font-size:16px;margin:0 0 24px;">${escapeHtml(overview)}</p>` : ""}
    ${metaBlock}
    ${outcome ? `<p style="font-weight:600;color:${TOKENS.matchaDeep};margin:0 0 32px;">${escapeHtml(outcome)}</p>` : ""}
    ${highlightsBlock}
    ${linksBlock}
  </main>
</div>`;
}

// ---------------------------------------------------------------------------
// 4. JSON-LD: CreativeWork (portfolio case study) + the same Person entity
// used on the homepage, referenced by @id — chosen over SoftwareApplication
// because these are portfolio case studies of varied kinds (an art
// installation, a game, a LINE bot, an app, a website), not app-store-style
// listings; SoftwareApplication's expected properties (operatingSystem,
// applicationCategory…) don't map cleanly across all five. CreativeWork is
// the correct general-purpose parent type for "a piece of work someone made".
// ---------------------------------------------------------------------------
const PERSON_LD = {
  "@type": "Person",
  "@id": "https://znye6302.com/#person",
  name: "葉子倪",
  alternateName: ["YE Zi-Ni", "Zini Ye", "葉子倪"],
  url: "https://znye6302.com",
  jobTitle: "Creative Developer",
  knowsAbout: [
    "Human-Computer Interaction",
    "Creative Coding",
    "Frontend Development",
    "React",
    "Interaction Design",
    "GSAP",
    "p5.js",
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "國立政治大學 數位內容學程" },
  sameAs: ["https://github.com/zn6302"],
  email: "znye.6302@gmail.com",
};

function projectJsonLd(project, seoEntry) {
  const creativeWork = {
    "@type": "CreativeWork",
    name: project.title,
    description: seoEntry.seoDescription,
    author: { "@id": "https://znye6302.com/#person" },
    keywords: project.tech,
    image: seoEntry.ogImage,
    url: seoEntry.canonical,
  };
  if (project.links?.live) creativeWork.sameAs = [project.links.live];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [PERSON_LD, creativeWork] }, null, 2);
}

// ---------------------------------------------------------------------------
// 5. <head> patching — targeted tag replacement on the built dist/index.html.
// ---------------------------------------------------------------------------
function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`prerender: could not locate "${label}" in dist/index.html template`);
  }
  return html.replace(regex, replacement);
}

function buildProjectPage(template, project, seoEntry) {
  let html = template;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seoEntry.seoTitle)}</title>`, "<title>");

  html = replaceOnce(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${escapeAttr(seoEntry.seoDescription)}" />`,
    'meta name="description"',
  );

  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeAttr(seoEntry.canonical)}" />`,
    'link rel="canonical"',
  );

  html = replaceOnce(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(seoEntry.seoTitle)}" />`,
    'meta property="og:title"',
  );

  html = replaceOnce(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(seoEntry.seoDescription)}" />`,
    'meta property="og:description"',
  );

  html = replaceOnce(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${escapeAttr(seoEntry.canonical)}" />`,
    'meta property="og:url"',
  );

  html = replaceOnce(
    html,
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${escapeAttr(seoEntry.ogImage)}" />`,
    'meta property="og:image"',
  );

  html = replaceOnce(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(seoEntry.seoTitle)}" />`,
    'meta name="twitter:title"',
  );

  html = replaceOnce(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttr(seoEntry.seoDescription)}" />`,
    'meta name="twitter:description"',
  );

  html = replaceOnce(
    html,
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${escapeAttr(seoEntry.ogImage)}" />`,
    'meta name="twitter:image"',
  );

  html = replaceOnce(
    html,
    /<script type="application\/ld\+json" id="ld-json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="ld-json">${projectJsonLd(project, seoEntry)}</script>`,
    'script#ld-json',
  );

  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${renderProjectHtml(project)}</div>`,
    '<div id="root">',
  );

  return html;
}

// ---------------------------------------------------------------------------
// 6. sitemap.xml + robots.txt
// ---------------------------------------------------------------------------
function buildSitemap(SITE_URL, projectsSeo, today) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    ...projectsSeo.map((p) => ({ loc: p.canonical, priority: "0.8" })),
  ];
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

// dev.znye6302.com (the fixed dev preview site) and any non-main Cloudflare
// preview URL serve the exact same build as the production site
// (https://znye6302.com) — see README.md "分支與部署". Left unguarded, that's
// a second publicly-crawlable copy of the whole site: real duplicate-content
// risk. Cloudflare Workers Builds sets WORKERS_CI_BRANCH during the build
// step, so we use it here to only ship an indexable robots.txt when this
// build is actually main (or a local/dev-machine build, where the var is
// unset) — every other branch gets a blanket Disallow. Canonical tags are
// still hardcoded to the production SITE_URL regardless (see seo.ts) as a
// second layer of protection even if this check is ever bypassed.
function buildRobots(SITE_URL) {
  const branch = process.env.WORKERS_CI_BRANCH;
  const isProductionBuild = !branch || branch === "main";
  const header = `# dev.znye6302.com 與非 main 分支的 Cloudflare preview 網址，實際上部署的是同一份
# build 產物（見 README.md「分支與部署」），若原樣允許索引，會與正式站
# ${SITE_URL} 形成重複內容（duplicate content）。因此依 Cloudflare Workers
# Builds 在 build 階段注入的 WORKERS_CI_BRANCH 環境變數分流：本機開發（未設定
# 該變數）與 main 分支才產生允許索引的版本，其餘分支一律 Disallow 全站。
`;
  if (!isProductionBuild) {
    return `${header}User-agent: *\nDisallow: /\n`;
  }
  return `${header}User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const templatePath = path.join(distDir, "index.html");
  let template;
  try {
    template = await fs.readFile(templatePath, "utf8");
  } catch {
    throw new Error(`prerender: ${templatePath} not found — run "vite build" first`);
  }

  const { projects, seo } = await loadData();
  const { SITE_URL, projectsSeo, getProjectSeo } = seo;

  const today = new Date().toISOString().slice(0, 10);

  let count = 0;
  for (const project of projects) {
    const seoEntry = getProjectSeo(project.id);
    if (!seoEntry) {
      console.warn(`prerender: no SEO entry for project "${project.id}", skipping`);
      continue;
    }
    const page = buildProjectPage(template, project, seoEntry);
    const outDir = path.join(distDir, "projects", project.id);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), page, "utf8");
    count += 1;
  }

  await fs.writeFile(path.join(distDir, "sitemap.xml"), buildSitemap(SITE_URL, projectsSeo, today), "utf8");
  await fs.writeFile(path.join(distDir, "robots.txt"), buildRobots(SITE_URL), "utf8");

  console.log(`prerender: wrote ${count} project page(s), sitemap.xml, robots.txt`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
