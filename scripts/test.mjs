import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function collect(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? collect(path) : /\.test\.(mjs|ts)$/.test(entry.name) ? [path] : [];
  });
}
const files = [...collect("scripts"), ...collect("src/lib")];
if (!files.length) throw new Error("No tests discovered");
const result = spawnSync(process.execPath, ["--experimental-strip-types", "--test", ...files], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
