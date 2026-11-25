import assert from "node:assert/strict";
import { test, after } from "node:test";
import {
  activateSave,
  flushProgress,
  getSaveSnapshot,
  readStoredSave,
  setProgressTransport,
  updateSave,
} from "./progress-store.ts";
import { progressSchema } from "./progress-schema.ts";
import type { Save } from "./progress.ts";

const memory = new Map<string, string>();
Object.assign(globalThis, {
  window: {},
  localStorage: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  },
});
after(async () => {
  await activateSave(null);
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "localStorage");
});

test("progress schema rejects invalid maps and oversized notes", () => {
  for (const value of [
    { correct: null },
    { correct: [] },
    { correct: { x: -1 } },
    { attempts: { x: "2" } },
    { notes: { x: "a".repeat(20001) } },
    { dayStreak: Infinity },
    { userId: "another-user" },
  ]) {
    assert.equal(
      progressSchema.safeParse(value).success,
      false,
      JSON.stringify(value).slice(0, 100),
    );
  }
});
test("interview answers support the original human-readable question keys", () => {
  const save = progressSchema.parse({
    lpdp: { interview: { "Mengapa kamu memilih program studi ini?": "Jawaban saya." } },
  });
  assert.equal(save.lpdp.interview["Mengapa kamu memilih program studi ini?"], "Jawaban saya.");
});
test("legacy local progress preserves previously earned mastery", () => {
  memory.set("legacy", JSON.stringify({ correct: { bilangan: 3, aljabar: 2 } }));
  assert.deepEqual(readStoredSave("legacy").hard, { bilangan: 1 });
  memory.set("legacy", JSON.stringify({ correct: { bilangan: 3 }, hard: {} }));
  assert.deepEqual(readStoredSave("legacy").hard, {});
});
test("each account and the guest have isolated progress", async () => {
  setProgressTransport({
    get: async () => ({ data: null, revision: 0 }),
    put: async () => ({ ok: true, revision: 1 }),
  });
  await activateSave(null);
  updateSave((s) => ({ ...s, notes: { guest: "guest note" } }));
  await activateSave("alice");
  assert.deepEqual(getSaveSnapshot().save.notes, {});
  updateSave((s) => ({ ...s, notes: { private: "Alice's note" } }));
  await flushProgress();
  await activateSave("bob");
  assert.deepEqual(getSaveSnapshot().save.notes, {});
  await activateSave(null);
  assert.equal(getSaveSnapshot().save.notes.guest, "guest note");
  assert.equal(getSaveSnapshot().save.notes.private, undefined);
});
test("a stale revision preserves the local copy and reports conflict", async () => {
  setProgressTransport({
    get: async () => ({ data: null, revision: 0 }),
    put: async () => ({ ok: false, revision: 0 }),
  });
  await activateSave("conflict-test");
  updateSave((s) => ({ ...s, notes: { draft: "local draft" } }));
  await flushProgress();
  assert.equal(getSaveSnapshot().status, "conflict");
  assert.equal(getSaveSnapshot().save.notes.draft, "local draft");
});
test("an old request cannot leak data after switching accounts", async () => {
  let resolveOld!: (value: { data: Save; revision: number }) => void;
  setProgressTransport({
    get: () =>
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
    put: async () => ({ ok: true, revision: 1 }),
  });
  const oldLoad = activateSave("old-account");
  await activateSave(null);
  resolveOld({
    data: { ...progressSchema.parse({}), notes: { secret: "private" } } as Save,
    revision: 1,
  });
  await oldLoad;
  assert.equal(getSaveSnapshot().status, "guest");
  assert.equal(getSaveSnapshot().save.notes.secret, undefined);
});
