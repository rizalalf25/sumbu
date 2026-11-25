import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";

const base = checkedUrl(process.env.E2E_BASE_URL || "http://localhost:8080");
const out = join(process.cwd(), "screenshots");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || undefined,
});
const checks = [];
const runtimeErrors = [];
const runId = Date.now().toString(36);
const password = `Sumbu-${runId}-test-928!`;
function record(label) {
  checks.push(label);
  console.log(`PASS ${label}`);
}
async function pageFor(context) {
  const page = await context.newPage();
  page.on("pageerror", (err) => runtimeErrors.push(err.message));
  return page;
}
async function register(page, label) {
  await page.goto(`${base}/login`);
  await page.getByRole("button", { name: "Daftar", exact: true }).click();
  await page.getByLabel("Nama", { exact: true }).fill(`QC ${label}`);
  await page.getByLabel("Email", { exact: true }).fill(`${label}-${runId}@sumbu.test`);
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
}
async function writeNote(page, text) {
  await page.goto(`${base}/belajar/bilangan`);
  await page.getByRole("button", { name: "Catat", exact: true }).click();
  await page.getByRole("textbox", { name: "Catatan dua kalimat" }).fill(text);
  await page.goto(`${base}/dashboard`);
  await page.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
}
try {
  const guestContext = await browser.newContext();
  const guest = await pageFor(guestContext);
  for (const path of [
    "/",
    "/peta",
    "/lpdp",
    "/kode",
    "/proyek",
    "/rumus",
    "/metode",
    "/belajar/bilangan",
    "/latihan/bilangan",
  ]) {
    const response = await guest.goto(base + path);
    assert.equal(response.status(), 200, path);
    await guest.locator("h1").waitFor();
    assert.ok((await guest.locator("main").innerText()).length > 80, path);
  }
  record("Guest can access educational pages without login");
  await guest.goto(`${base}/dashboard`);
  await guest
    .locator("main")
    .getByRole("link", { name: "Masuk atau daftar", exact: true })
    .waitFor();
  record("Account dashboard requires login");

  const aliceContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const alice = await pageFor(aliceContext);
  await register(alice, "alice");
  record("Registration creates a real session and dashboard");
  await alice.clock.install();
  await alice.getByRole("button", { name: "Mulai timer", exact: true }).click();
  await alice.clock.fastForward(25 * 60 * 1000 + 500);
  assert.match(await alice.getByRole("article").filter({ hasText: "Sesi fokus" }).innerText(), /1/);
  await alice.clock.resume();
  record("Completing a focus timer records one study session");
  await alice.screenshot({ path: join(out, "dashboard.png"), fullPage: true });
  const secretNote = `Catatan pribadi Alice ${runId}`;
  await writeNote(alice, secretNote);
  await alice.reload();
  await alice.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  await alice.goto(`${base}/belajar/bilangan`);
  await alice.getByRole("button", { name: "Catat", exact: true }).click();
  assert.equal(
    await alice.getByRole("textbox", { name: "Catatan dua kalimat" }).inputValue(),
    secretNote,
  );
  record("Private notes survive reload and synchronize to backend");

  await alice.goto(`${base}/ruang`);
  await alice.getByRole("button", { name: "Buat ruang", exact: true }).click();
  const roomName = `QC Aljabar ${runId}`;
  await alice.getByLabel("Nama ruang").fill(roomName);
  await alice.getByLabel("Materi", { exact: true }).selectOption("aljabar");
  await alice.getByRole("button", { name: "Buat ruang terbuka", exact: true }).click();
  await alice
    .getByRole("article")
    .filter({ hasText: roomName })
    .getByRole("link", { name: "Buka diskusi" })
    .click();
  const roomUrl = alice.url();
  await alice.getByLabel("Pesan Anda").fill("Mari belajar aljabar bersama.");
  await alice.getByRole("button", { name: "Kirim", exact: true }).click();
  await alice.getByText("Mari belajar aljabar bersama.", { exact: true }).waitFor();
  record("Create a public room and publish a discussion message");

  const bobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const bob = await pageFor(bobContext);
  await register(bob, "bob");
  await bob.goto(`${base}/belajar/bilangan`);
  await bob.getByRole("button", { name: "Catat", exact: true }).click();
  assert.equal(await bob.getByRole("textbox", { name: "Catatan dua kalimat" }).inputValue(), "");
  assert.ok(!(await bob.locator("body").innerText()).includes(secretNote));
  record("Two users have separate private progress and notes");
  await bob.goto(roomUrl);
  await bob.getByRole("alert").waitFor();
  assert.ok(!(await bob.locator("body").innerText()).includes("Mari belajar aljabar bersama."));
  record("Nonmembers cannot read room messages");
  await bob.goto(`${base}/ruang`);
  await bob
    .getByRole("article")
    .filter({ hasText: roomName })
    .getByRole("button", { name: "Gabung ruang" })
    .click();
  await bob
    .getByRole("article")
    .filter({ hasText: roomName })
    .getByRole("link", { name: "Buka diskusi" })
    .click();
  await bob.getByText("Mari belajar aljabar bersama.", { exact: true }).waitFor();
  assert.equal(await bob.getByRole("button", { name: "Hapus pesan QC alice" }).count(), 0);
  record("Join without invitation; only authorized users can delete messages");
  await bob.getByLabel("Pesan Anda").fill("Aku sudah bergabung tanpa kode undangan.");
  await bob.getByRole("button", { name: "Kirim", exact: true }).click();
  await bob.getByText("Aku sudah bergabung tanpa kode undangan.", { exact: true }).waitFor();
  await bob.screenshot({ path: join(out, "room-mobile.png"), fullPage: true });
  assert.equal(
    await bob.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
    false,
  );
  record("Mobile room works without horizontal overflow");
  await alice.getByRole("button", { name: "Muat ulang", exact: true }).click();
  await alice.getByText("Aku sudah bergabung tanpa kode undangan.", { exact: true }).waitFor();
  await alice.getByRole("button", { name: "Hapus pesan QC bob" }).click();
  await alice
    .getByText("Aku sudah bergabung tanpa kode undangan.", { exact: true })
    .waitFor({ state: "detached" });
  record("Room owner can moderate another member's message");
  await alice.screenshot({ path: join(out, "room-desktop.png"), fullPage: true });

  await alice.goto(`${base}/dashboard`);
  await alice.getByRole("button", { name: "Keluar", exact: true }).click();
  await alice.waitForURL(base + "/");
  await alice.goto(`${base}/login`);
  await alice.getByLabel("Email", { exact: true }).fill(`alice-${runId}@sumbu.test`);
  await alice.getByLabel("Kata sandi", { exact: true }).fill("a-wrong-password");
  await alice.locator("form").getByRole("button", { name: "Masuk", exact: true }).click();
  await alice.getByRole("alert").waitFor();
  assert.match(await alice.getByRole("alert").innerText(), /salah/);
  await alice.getByLabel("Kata sandi", { exact: true }).fill(password);
  await alice.locator("form").getByRole("button", { name: "Masuk", exact: true }).click();
  await alice.waitForURL("**/dashboard");
  record("Logout, incorrect password rejection, and login all work");
  const otherDevice = await browser.newContext();
  const device = await pageFor(otherDevice);
  await device.goto(`${base}/login`);
  await device.getByLabel("Email", { exact: true }).fill(`alice-${runId}@sumbu.test`);
  await device.getByLabel("Kata sandi", { exact: true }).fill(password);
  await device.locator("form").getByRole("button", { name: "Masuk", exact: true }).click();
  await device.waitForURL("**/dashboard");
  await device.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  await device.goto(`${base}/belajar/bilangan`);
  await device.getByRole("button", { name: "Catat", exact: true }).click();
  assert.equal(
    await device.getByRole("textbox", { name: "Catatan dua kalimat" }).inputValue(),
    secretNote,
  );
  record("A new browser session retrieves the same account progress");
  await writeNote(device, "Perubahan dari perangkat baru.");
  await alice.getByRole("link", { name: "Lanjut belajar", exact: false }).click();
  await alice.getByRole("button", { name: "Catat", exact: true }).click();
  await alice
    .getByRole("textbox", { name: "Catatan dua kalimat" })
    .fill("Draf lokal perangkat lama.");
  await alice.goto(`${base}/dashboard`);
  await alice.getByText("Ada perubahan dari perangkat lain", { exact: true }).waitFor();
  await device.goto(`${base}/dashboard`);
  await device.reload();
  await device.getByText("Progres tersimpan di akun", { exact: true }).waitFor();
  await device.goto(`${base}/belajar/bilangan`);
  await device.getByRole("button", { name: "Catat", exact: true }).click();
  assert.equal(
    await device.getByRole("textbox", { name: "Catatan dua kalimat" }).inputValue(),
    "Perubahan dari perangkat baru.",
  );
  record("Stale device revisions cannot silently overwrite newer account progress");
  assert.deepEqual(runtimeErrors, []);
  record("No uncaught browser errors during tested flows");
  writeFileSync(
    join(out, "learning-e2e.json"),
    JSON.stringify({ ok: true, base, checks, runtimeErrors }, null, 2),
  );
} catch (err) {
  for (const context of browser.contexts()) {
    for (const page of context.pages()) {
      await page
        .screenshot({
          path: join(out, `failure-${browser.contexts().indexOf(context)}.png`),
          fullPage: true,
        })
        .catch(() => {});
      console.error(
        "Failed page:",
        page.url(),
        (
          await page
            .locator("main")
            .innerText()
            .catch(() => "")
        ).slice(0, 1800),
      );
    }
  }
  writeFileSync(
    join(out, "learning-e2e.json"),
    JSON.stringify({ ok: false, base, checks, error: String(err), runtimeErrors }, null, 2),
  );
  throw err;
} finally {
  await browser.close();
}
