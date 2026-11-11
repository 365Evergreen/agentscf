import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const oxfmtCli = join(dirname(require.resolve("oxfmt/package.json")), "bin", "oxfmt");

function findDeclarationFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return findDeclarationFiles(path);
    }

    return path.endsWith(".d.ts") ? [path] : [];
  });
}

export function formatDeclarationFiles(directory = "dist") {
  const declarationFiles = findDeclarationFiles(directory);

  if (declarationFiles.length > 0) {
    execFileSync(process.execPath, [oxfmtCli, "--write", ...declarationFiles], {
      stdio: "inherit"
    });
  }
}
