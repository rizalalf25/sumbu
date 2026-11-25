import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";
import { LESSONS, LANGS, lessonsOf } from "../src/lib/code.ts";
import { SUBTES } from "../src/lib/lpdp.ts";

const base = checkedUrl(process.env.E2E_BASE_URL || "http://localhost:8080");
const out = join(process.cwd(), "screenshots");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || undefined,
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const checks = [];
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
const record = (label) => {
  checks.push(label);
  console.log(`PASS ${label}`);
};
const step = (name) =>
  page
    .getByRole("navigation", { name: "Alur belajar kode" })
    .getByRole("button", { name: new RegExp(name) });
async function saved() {
  await page.goto(`${base}/dashboard`);
  await page.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
}
try {
  for (const lang of LANGS) {
    const list = lessonsOf(lang.id);
    for (const lesson of [list[0], list.at(-1)]) {
      await page.goto(`${base}/kode/${lesson.id}`);
      await step("Catat").click();
      assert.equal(
        await page
          .getByRole("navigation", { name: "Alur belajar kode" })
          .getByRole("button")
          .count(),
        7,
      );
      if (lesson === list.at(-1))
        await page.getByRole("link", { name: "Coba tantangan kode", exact: true }).waitFor();
    }
  }
  record("All five languages have seven steps and a usable final lesson");
  const first = LESSONS.find((l) => l.id === "py-dasar");
  await page.goto(`${base}/kode/py-dasar`);
  await step("Tebak").click();
  await page.getByRole("radio").nth(0).click();
  await page.getByText("Belum pas. Telusuri lagi sebelum mencoba.", { exact: true }).waitFor();
  assert.ok(!(await page.locator("main").innerText()).includes("sudah lulus kuis"));
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await page.getByRole("radio").nth(first.quiz.answer).click();
  await page.getByText("Pas. Pelajaran lulus kuis.", { exact: true }).waitFor();
  await step("Coba").click();
  const draft = 'print("Percobaan tersimpan")';
  await page.getByRole("textbox", { name: "Editor Python", exact: true }).fill(draft);
  await step("Catat").click();
  const note = "Saya memahami input, proses, dan keluaran.";
  await page.getByLabel("Catatan belajar kode", { exact: true }).fill(note);
  await page.reload();
  await page.getByLabel("Catatan belajar kode", { exact: true }).waitFor();
  assert.equal(await page.getByLabel("Catatan belajar kode", { exact: true }).inputValue(), note);
  await step("Coba").click();
  assert.equal(
    await page.getByRole("textbox", { name: "Editor Python", exact: true }).inputValue(),
    draft,
  );
  record("Wrong answers can be retried; passing, final step, notes and drafts survive reload");
  await page.goto(`${base}/kode/sql-select`);
  await step("Coba").click();
  await page
    .getByRole("textbox", { name: "Editor SQL", exact: true })
    .fill("SELECT 6 * 7 AS hasil;");
  await page.getByRole("button", { name: "▶ Jalankan", exact: true }).click();
  await page.getByRole("cell", { name: "42", exact: true }).waitFor();
  record("The SQL experiment runs the edited draft and produces the real result");
  await page.screenshot({ path: join(out, "kode-desktop.png"), fullPage: true });
  for (const sub of SUBTES) {
    await page.goto(`${base}/lpdp/${sub.id}`);
    for (const kind of sub.kinds) {
      await page.getByLabel("Jenis contoh", { exact: true }).selectOption(kind.id);
      const example = page.getByRole("region", { name: "Contoh dikerjakan", exact: true });
      assert.ok(
        (await example
          .getByRole("region", { name: "Cara pengerjaan", exact: true })
          .getByRole("listitem")
          .count()) >= 4,
      );
      await example.getByRole("button", { name: "Latihan jenis ini", exact: true }).click();
      const practice = page.locator("#latihan");
      assert.equal(
        await practice.getByRole("region", { name: "Cara pengerjaan", exact: true }).count(),
        0,
      );
      await practice
        .getByRole("button", { name: "Lihat petunjuk cara memulai", exact: true })
        .click();
      assert.equal(
        await practice.getByRole("region", { name: "Cara pengerjaan", exact: true }).count(),
        0,
      );
      await practice.getByRole("radio").first().click();
      await practice.getByRole("region", { name: "Cara pengerjaan", exact: true }).waitFor();
    }
  }
  record("All 17 LPDP kinds offer examples, practice hints and solutions only after answering");
  await page.goto(`${base}/lpdp/simulasi`);
  await page.getByRole("button", { name: "Mulai sekarang", exact: true }).click();
  await page.getByRole("radio").first().click();
  assert.equal(await page.getByRole("region", { name: "Cara pengerjaan", exact: true }).count(), 0);
  await page
    .getByRole("navigation", { name: "Lompat ke soal" })
    .getByRole("button", { name: "Soal 30", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Selesai", exact: true }).click();
  await page.getByRole("heading", { name: "Hasil simulasi", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("region", { name: "Cara pengerjaan", exact: true }).count(),
    30,
  );
  record("Simulation hides solutions during the timer and shows all 30 after completion");
  const run = Date.now();
  const email = `education-${run}@sumbu.test`;
  const password = `Sumbu-QC-${run}!`;
  await page.goto(`${base}/login`);
  await page.getByRole("button", { name: "Daftar", exact: true }).click();
  await page.getByLabel("Nama", { exact: true }).fill("QC pendidikan");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  await page.goto(`${base}/kode/py-dasar`);
  await step("Catat").click();
  await page
    .getByLabel("Catatan belajar kode", { exact: true })
    .fill("Catatan akun lintas perangkat");
  await saved();
  await page.goto(`${base}/lpdp/kuantitatif`);
  await page.locator("#latihan").getByRole("radio").first().click();
  await saved();
  const device = await browser.newContext();
  const second = await device.newPage();
  second.on("pageerror", (err) => errors.push(err.message));
  await second.goto(`${base}/login`);
  await second.getByLabel("Email", { exact: true }).fill(email);
  await second.getByLabel("Kata sandi", { exact: true }).fill(password);
  await second.locator("form").getByRole("button", { name: "Masuk", exact: true }).click();
  await second.waitForURL("**/dashboard");
  await second.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  await second.goto(`${base}/kode/py-dasar`);
  await second.getByLabel("Catatan belajar kode", { exact: true }).waitFor();
  assert.equal(
    await second.getByLabel("Catatan belajar kode", { exact: true }).inputValue(),
    "Catatan akun lintas perangkat",
  );
  await second.goto(`${base}/dashboard`);
  await second.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  const downloadReady = second.waitForEvent("download");
  await second.getByRole("button", { name: "Unduh cadangan progres", exact: true }).click();
  const download = await downloadReady;
  const backup = JSON.parse(readFileSync(await download.path(), "utf8"));
  assert.equal(
    Object.values(backup.lpdp.right).reduce((a, b) => a + b, 0) +
      Object.values(backup.lpdp.wrong).reduce((a, b) => a + b, 0),
    1,
  );
  assert.ok(
    [...Object.keys(backup.lpdp.right), ...Object.keys(backup.lpdp.wrong)].some((key) =>
      key.startsWith("kuantitatif:"),
    ),
  );
  record("Code notes and LPDP answers persist on the server and load on another device");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/kode/py-dasar", "/lpdp/kuantitatif"]) {
    await page.goto(base + path);
    await page.locator("h1").waitFor();
    await page.locator('main[aria-busy="false"]').waitFor();
    if (path.includes("kode")) await step("Catat").click();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true,
      path,
    );
    await page.screenshot({
      path: join(out, path.includes("kode") ? "kode-mobile.png" : "lpdp-mobile.png"),
      fullPage: true,
    });
  }
  record("Code and LPDP pages fit mobile screens without horizontal overflow");
  assert.deepEqual(errors, []);
  record("No uncaught browser errors in the education flows");
  writeFileSync(
    join(out, "education-e2e.json"),
    JSON.stringify({ ok: true, base, checks, errors }, null, 2),
  );
} catch (err) {
  await page
    .screenshot({ path: join(out, "education-failure.png"), fullPage: true })
    .catch(() => {});
  throw err;
} finally {
  await browser.close();
}
