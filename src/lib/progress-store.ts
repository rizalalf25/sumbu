import type { Save } from "./progress";
import { progressSchema } from "./progress-schema.ts";

type Transport = {
  get: () => Promise<{ data: Save | null; revision: number }>;
  put: (input: { data: Save; revision: number }) => Promise<{ ok: boolean; revision: number }>;
};
let transport: Transport;
export function setProgressTransport(value: Transport) {
  transport = value;
}

export type SyncStatus = "loading" | "guest" | "saved" | "saving" | "offline" | "conflict";
const empty = progressSchema.parse({}) as Save;
const serverSnapshot = { save: empty, ready: false, status: "loading" as SyncStatus };
let snapshot = serverSnapshot;
let scope = "pending";
let revision = 0;
let dirty = false;
let connected = false;
let generation = 0;
let inFlight = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const key = () => (scope === "guest" ? "sumbu-v1" : `sumbu-account-${scope}`);
function emit() {
  listeners.forEach((fn) => fn());
}
function setStatus(status: SyncStatus) {
  snapshot = { ...snapshot, status };
  emit();
}
function persist() {
  try {
    localStorage.setItem(key(), JSON.stringify(snapshot.save));
    localStorage.setItem(`${key()}:sync`, JSON.stringify({ revision, dirty }));
  } catch {
    /* Quota/private mode: retain the in-memory copy. */
  }
}
export function readStoredSave(storageKey?: string): Save {
  if (typeof window === "undefined") return empty;
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey ?? key()) || "{}");
    const parsed = progressSchema.safeParse(raw);
    // Earlier SUMBU saves did not record difficulty. Preserve earned mastery.
    if (parsed.success && raw.hard === undefined) {
      parsed.data.hard = Object.fromEntries(
        Object.entries(parsed.data.correct)
          .filter(([, n]) => n >= 3)
          .map(([id]) => [id, 1]),
      );
    }
    return parsed.success ? (parsed.data as Save) : empty;
  } catch {
    return empty;
  }
}
export function getSaveSnapshot() {
  return snapshot;
}
export function getServerSaveSnapshot() {
  return serverSnapshot;
}
export function subscribeSave(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function updateSave(fn: (save: Save) => Save) {
  if (!snapshot.ready) return;
  snapshot = { ...snapshot, save: fn(snapshot.save) };
  dirty = true;
  persist();
  emit();
  scheduleSave();
}
function scheduleSave() {
  clearTimeout(timer);
  if (scope === "guest" || !connected || snapshot.status === "conflict") return;
  setStatus("saving");
  timer = setTimeout(() => {
    void flushProgress();
  }, 700);
}
export async function flushProgress() {
  if (!dirty || inFlight || !connected || scope === "guest" || snapshot.status === "conflict")
    return;
  const requestGeneration = generation;
  const sent = snapshot.save;
  inFlight = true;
  setStatus("saving");
  try {
    const result = await transport.put({ data: sent, revision });
    if (requestGeneration !== generation) return;
    if (!result.ok) {
      connected = false;
      setStatus("conflict");
      return;
    }
    revision = result.revision;
    dirty = snapshot.save !== sent;
    persist();
    setStatus(dirty ? "saving" : "saved");
  } catch {
    if (requestGeneration === generation) setStatus("offline");
  } finally {
    if (requestGeneration === generation) {
      inFlight = false;
      if (dirty && snapshot.status === "saving") scheduleSave();
    }
  }
}
export async function activateSave(userId: string | null, force = false) {
  const nextScope = userId ?? "guest";
  if (!force && scope === nextScope) return;
  clearTimeout(timer);
  scope = nextScope;
  const requestGeneration = ++generation;
  inFlight = false;
  connected = false;
  revision = 0;
  dirty = false;
  try {
    const meta = JSON.parse(localStorage.getItem(`${key()}:sync`) || "{}");
    revision = Number.isInteger(meta.revision) && meta.revision >= 0 ? meta.revision : 0;
    dirty = meta.dirty === true;
  } catch {
    /* Fresh storage. */
  }
  snapshot = { save: readStoredSave(), ready: !userId, status: userId ? "loading" : "guest" };
  emit();
  if (!userId) return;
  try {
    const remote = await transport.get();
    if (requestGeneration !== generation) return;
    if (dirty && remote.revision !== revision) {
      snapshot = { ...snapshot, ready: true, status: "conflict" };
    } else {
      revision = remote.revision;
      connected = true;
      snapshot = {
        save: dirty ? snapshot.save : ((remote.data as Save | null) ?? empty),
        ready: true,
        status: "saved",
      };
      persist();
    }
    emit();
    if (dirty && connected) scheduleSave();
  } catch {
    if (requestGeneration !== generation) return;
    snapshot = { ...snapshot, ready: true, status: "offline" };
    emit();
  }
}
export async function retryProgress() {
  if (snapshot.status !== "conflict") await activateSave(scope === "guest" ? null : scope, true);
}
export async function reloadCloudProgress() {
  if (scope === "guest" || scope === "pending") return;
  try {
    localStorage.setItem(`${key()}:recovery`, JSON.stringify(snapshot.save));
  } catch {
    /* Best effort. */
  }
  dirty = false;
  persist();
  await activateSave(scope, true);
}
