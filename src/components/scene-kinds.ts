import type { SceneKind } from "./scenes";

// Daftar jenis adegan 3D. Record memaksa TypeScript menolak bila ada jenis yang terlewat atau salah ketik.
const KINDS: Record<SceneKind, true> = {
  projectile: true,
  pendulum: true,
  wave: true,
  vector: true,
  charges: true,
  surface: true,
  field: true,
};

export function isSceneKind(kind: string): kind is SceneKind {
  return Object.hasOwn(KINDS, kind);
}
