import { test } from "node:test";
import assert from "node:assert/strict";
import { accountsMode, missingAccountEnv } from "./accounts-mode.mjs";

test("di luar Vercel akun selalu aktif", () => {
  assert.equal(accountsMode({}), "on");
  assert.equal(accountsMode({ DATABASE_URL: "" }), "on");
});

test("Vercel tanpa satu pun pengaturan akun tayang tanpa akun", () => {
  assert.equal(accountsMode({ VERCEL: "1" }), "off");
  assert.equal(accountsMode({ VERCEL: "1", DATABASE_URL: "  ", BETTER_AUTH_SECRET: "" }), "off");
});

test("Vercel dengan ketiga pengaturan akun memakai mode akun; sebagian saja tetap tanpa akun", () => {
  assert.equal(
    accountsMode({
      VERCEL: "1",
      DATABASE_URL: "postgres://x",
      BETTER_AUTH_SECRET: "s",
      BETTER_AUTH_URL: "https://a.b",
    }),
    "on",
  );
  // Integrasi database sering mengisi DATABASE_URL lebih dulu; tanpa dua pengaturan auth, tetap tanpa akun.
  assert.equal(accountsMode({ VERCEL: "1", DATABASE_URL: "postgres://x" }), "off");
  assert.deepEqual(missingAccountEnv({ VERCEL: "1", DATABASE_URL: "postgres://x" }), [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ]);
});
