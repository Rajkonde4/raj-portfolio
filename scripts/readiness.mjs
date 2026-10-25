#!/usr/bin/env node
/**
 * Pre-launch readiness report. Run with `npm run readiness`.
 *
 * It reads files only (no network) and prints what still needs your attention
 * before the site is shown to recruiters. It never fails the build: items are
 * "blocker" (fix before launch), "warning" (should fix) or "info".
 * Exit code is 1 only when a blocker exists, so you can also use it in CI.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * @param {string} [root]
 * @param {Partial<Record<string, string>>} [env]
 */
export function collectChecks(root = process.cwd(), env = process.env) {
  const checks = [];
  const add = (level, title, detail) => checks.push({ level, title, detail });

  const contentFiles = walk(join(root, "src/content")).filter((f) =>
    f.endsWith(".ts"),
  );
  const todos = [];
  for (const file of contentFiles) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (line.includes("TODO(Raj)"))
          todos.push(`${relative(root, file)}:${i + 1}`);
      });
  }
  if (todos.length)
    add(
      "warning",
      `${todos.length} TODO(Raj) note(s) left in content`,
      todos.join(", "),
    );

  const placeholder = contentFiles.filter((f) =>
    /Details to be added/i.test(readFileSync(f, "utf8")),
  );
  if (placeholder.length)
    add(
      "blocker",
      "Placeholder text 'Details to be added' is still in content",
      placeholder.map((f) => relative(root, f)).join(", "),
    );

  const resume = join(root, "public/resume/Raj_Konde_Resume.pdf");
  if (!existsSync(resume))
    add(
      "blocker",
      "Resume PDF is missing",
      "Add public/resume/Raj_Konde_Resume.pdf",
    );

  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (!siteUrl)
    add(
      "warning",
      "NEXT_PUBLIC_SITE_URL is not set",
      "On Vercel the production domain is used automatically; set it explicitly once you have a custom domain.",
    );
  else if (/localhost|127\.0\.0\.1/.test(siteUrl))
    add("blocker", "NEXT_PUBLIC_SITE_URL points at localhost", siteUrl);

  for (const name of [".env", ".env.local", ".env.production"]) {
    if (existsSync(join(root, name)) && existsSync(join(root, ".git"))) {
      add(
        "info",
        `${name} exists locally`,
        "It is git-ignored; set the same values in the Vercel dashboard instead.",
      );
    }
  }

  const projects = readFileSync(join(root, "src/content/projects.ts"), "utf8");
  if (!/repository\s*:/.test(projects))
    add(
      "warning",
      "No project has a repository link",
      "Recruiters expect code links; add links.repository in src/content/projects.ts.",
    );
  if (!/contribution\s*:/.test(projects))
    add(
      "warning",
      "No project states your personal contribution",
      "Add `contribution` after checking what you actually built.",
    );

  const images = walk(join(root, "public/images")).filter(
    (f) => !f.endsWith(".md"),
  );
  if (!images.length)
    add(
      "info",
      "No profile photo or project screenshots yet",
      "Optional; the site works without them.",
    );

  const mailVars = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];
  const missing = mailVars.filter((v) => !(env[v] ?? "").trim());
  if (missing.length)
    add(
      "info",
      "Contact form is off in this environment",
      `Missing: ${missing.join(", ")}. The page shows email/social links instead.`,
    );

  return checks;
}

export function summarize(checks) {
  return {
    blockers: checks.filter((c) => c.level === "blocker").length,
    warnings: checks.filter((c) => c.level === "warning").length,
    info: checks.filter((c) => c.level === "info").length,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const checks = collectChecks();
  const label = { blocker: "BLOCKER", warning: "WARNING", info: "INFO   " };
  for (const c of checks) {
    console.log(`[${label[c.level]}] ${c.title}`);
    if (c.detail) console.log(`           ${c.detail}`);
  }
  const s = summarize(checks);
  console.log(
    `\n${s.blockers} blocker(s), ${s.warnings} warning(s), ${s.info} note(s).`,
  );
  process.exit(s.blockers ? 1 : 0);
}
