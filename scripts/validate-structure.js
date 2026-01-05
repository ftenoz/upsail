const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const requiredPaths = [
  "apps/web",
  "apps/api",
  "packages/shared",
  ".github/workflows/ci.yaml",
  "docs",
  "README.md",
  ".env.example",
  "package.json"
];

const missing = requiredPaths.filter((relPath) => {
  return !fs.existsSync(path.join(repoRoot, relPath));
});

if (missing.length > 0) {
  console.error("Repository structure validation failed.");
  missing.forEach((relPath) => console.error(`Missing: ${relPath}`));
  process.exit(1);
}

console.log("Repository structure validation passed.");
