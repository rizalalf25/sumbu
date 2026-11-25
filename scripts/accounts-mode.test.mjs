import { test } from "node:test";
import assert from "node:assert/strict";
import { accountsMode } from "./accounts-mode.mjs";

test("di luar Vercel akun selalu aktif", () => {
  assert.equal(accountsMode({}), "on");
  assert.equal(accountsMode({ DATABASE_URL: "" }), "on");
});

test("Vercel tanpa satu pun pengaturan akun tayang tanpa akun", () => {
  assert.equal(accountsMode({ VERCEL: "1" }), "off");
  assert.equal(accountsMode({ VERCEL: "1", DATABASE_URL: "  ", BETTER_AUTH_SECRET: "" }), "off");
});

test("Vercel dengan pengaturan akun (lengkap atau sebagian) memakai mode akun", () => {
  assert.equal(
    accountsMode({
      VERCEL: "1",
      DATABASE_URL: "postgres://x",
      BETTER_AUTH_SECRET: "s",
      BETTER_AUTH_URL: "https://a.b",
    }),
    "on",
  );
  // Sebagian terisi tetap "on", supaya validate-deployment menggagalkan build dengan pesan jelas.
  assert.equal(accountsMode({ VERCEL: "1", DATABASE_URL: "postgres://x" }), "on");
});
