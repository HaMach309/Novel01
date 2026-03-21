import fs from "node:fs";
import path from "node:path";

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function writeText(p, s) {
  fs.writeFileSync(p, s, "utf8");
}

function chapterNumFromFilename(name) {
  const m = name.match(/^ch(\d{3})\.(md|txt)$/i);
  return m ? Number(m[1]) : null;
}

function buildChapterBlockRegex(chapterNum) {
  // Capture from the chapter header until (but not including) the next chapter header.
  // Keeps the header line itself as part of the replacement region.
  return new RegExp(
    String.raw`(^##\s+Chương\s+${chapterNum}\b[^\n]*\r?\n)([\s\S]*?)(?=^##\s+Chương\s+\d+\b|\Z)`,
    "m"
  );
}

function normalizeReplacement(repl, chapterNum) {
  // Ensure the replacement starts with the expected header.
  const headerRe = new RegExp(String.raw`^##\s+Chương\s+${chapterNum}\b`, "m");
  if (!headerRe.test(repl)) {
    throw new Error(
      `Replacement for ch${String(chapterNum).padStart(3, "0")} must include a header line starting with "## Chương ${chapterNum}".`
    );
  }
  return repl.replace(/\r?\n?$/, "\n");
}

function main() {
  const cwd = process.cwd();
  const vietSubPath = path.join(cwd, "VietSub.md");
  const inputDir = process.argv[2] ? path.resolve(cwd, process.argv[2]) : path.join(cwd, "retranslations_vi");

  if (!fs.existsSync(vietSubPath)) throw new Error(`Missing ${vietSubPath}`);
  if (!fs.existsSync(inputDir)) {
    throw new Error(
      `Missing input dir: ${inputDir}\nCreate it and put files like ch131.md containing the full replacement chapter (including its "## Chương N" header).`
    );
  }

  const files = fs.readdirSync(inputDir).filter((f) => /^ch\d{3}\.(md|txt)$/i.test(f));
  if (files.length === 0) {
    throw new Error(`No chXXX.md or chXXX.txt files found in ${inputDir}`);
  }

  let vietSub = readText(vietSubPath);
  const changed = [];
  const missing = [];

  for (const f of files) {
    const n = chapterNumFromFilename(f);
    if (!n) continue;
    const replPath = path.join(inputDir, f);
    const replRaw = readText(replPath);
    const repl = normalizeReplacement(replRaw, n);

    const re = buildChapterBlockRegex(n);
    if (!re.test(vietSub)) {
      missing.push(n);
      continue;
    }

    vietSub = vietSub.replace(re, () => repl);
    changed.push(n);
  }

  if (changed.length > 0) {
    writeText(vietSubPath, vietSub);
  }

  process.stdout.write(`Updated chapters: ${changed.sort((a, b) => a - b).join(", ") || "(none)"}\n`);
  if (missing.length > 0) process.stdout.write(`Chapter headers not found in VietSub.md: ${missing.sort((a, b) => a - b).join(", ")}\n`);
  process.stdout.write(`Input dir: ${inputDir}\n`);
}

main();

