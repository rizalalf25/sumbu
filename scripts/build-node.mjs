import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["scripts/with-app-env.mjs", "vite", "build"], {
  stdio: "inherit",
  env: { ...process.env, NITRO_PRESET: "node-server" },
});
process.exit(result.status ?? 1);
