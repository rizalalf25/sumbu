import { z } from "zod";

const id = z
  .string()
  .max(120)
  .regex(/^[a-zA-Z0-9_:-]+$/)
  .refine((key) => !["__proto__", "constructor", "prototype"].includes(key));
const count = z.number().int().min(0).max(1_000_000);
const counts = z.record(id, count).default({});
const textKey = z
  .string()
  .min(1)
  .max(500)
  .refine((key) => !["__proto__", "constructor", "prototype"].includes(key));
const texts = z.record(textKey, z.string().max(20_000)).default({});
const indices = z.record(id, z.array(z.number().int().min(0).max(1000)).max(1000)).default({});
export const progressSchema = z
  .object({
    correct: counts,
    hard: counts,
    code: counts,
    challenge: counts,
    attempts: counts,
    proj: indices,
    kit: indices,
    build: indices,
    drafts: texts,
    notes: texts,
    steps: counts,
    lpdp: z
      .object({
        right: counts,
        wrong: counts,
        essays: texts,
        interview: texts,
        sims: z
          .array(
            z.object({
              at: z.string().max(40),
              total: count,
              correct: count,
              seconds: count,
              per: z.record(id, z.tuple([count, count])),
            }),
          )
          .max(30)
          .default([]),
      })
      .default({ right: {}, wrong: {}, essays: {}, interview: {}, sims: [] }),
    lastTopic: id.nullable().default(null),
    road: id.nullable().default(null),
    dayStreak: count.default(0),
    lastDay: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .default(null),
    sessions: count.default(0),
  })
  .strict()
  .refine(
    (data) => new TextEncoder().encode(JSON.stringify(data)).length <= 500_000,
    "Cadangan terlalu besar (maksimal 500 KB).",
  );
