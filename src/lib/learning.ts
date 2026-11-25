import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./auth/middleware";
import { progressSchema } from "./progress-schema";

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    const [row] = await sql<{
      data: unknown;
      revision: number;
    }>`select data, revision from learning_progress where user_id = ${context.userId}`;
    return { data: row ? progressSchema.parse(row.data) : null, revision: row?.revision ?? 0 };
  });

export const putProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ data: progressSchema, revision: z.number().int().min(0) }))
  .handler(async ({ context, data }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    const rows = await sql<{ revision: number }>`
      insert into learning_progress (user_id, data, revision)
      select ${context.userId}, ${JSON.stringify(data.data)}::jsonb, 1 where ${data.revision} = 0
      on conflict (user_id) do update set data = excluded.data,
        revision = learning_progress.revision + 1, updated_at = now()
      where learning_progress.revision = ${data.revision}
      returning revision`;
    // Existing rows need an UPDATE when their expected revision is nonzero.
    if (rows[0]) return { ok: true as const, revision: rows[0].revision };
    if (data.revision > 0) {
      const updated = await sql<{ revision: number }>`update learning_progress
        set data = ${JSON.stringify(data.data)}::jsonb, revision = revision + 1, updated_at = now()
        where user_id = ${context.userId} and revision = ${data.revision} returning revision`;
      if (updated[0]) return { ok: true as const, revision: updated[0].revision };
    }
    return { ok: false as const, revision: data.revision };
  });

export const listRooms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    return sql<{
      id: string;
      name: string;
      topic_id: string;
      member_count: number;
      joined: boolean;
      owner_id: string;
    }>`
      select r.id, r.name, r.topic_id, r.owner_id, count(m.user_id)::int as member_count,
      exists(select 1 from study_members mine where mine.room_id = r.id and mine.user_id = ${context.userId}) as joined
      from study_rooms r left join study_members m on m.room_id = r.id
      group by r.id order by r.created_at desc limit 100`;
  });

export const createRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({ name: z.string().trim().min(3).max(80), topicId: z.string().max(120) }),
  )
  .handler(async ({ context, data }) => {
    const { allTopics } = await import("./topics");
    if (!allTopics().some((t) => t.id === data.topicId)) throw new Error("Materi tidak ditemukan.");
    const { getSql } = await import("./db");
    const { randomUUID } = await import("node:crypto");
    const sql = await getSql();
    const id = randomUUID();
    const rows = await sql<{ id: string }>`with created as (
      insert into study_rooms (id, name, topic_id, owner_id)
      select ${id}, ${data.name}, ${data.topicId}, ${context.userId}
      where (select count(*) from study_rooms where owner_id = ${context.userId}) < 10 returning id
    ) insert into study_members (room_id, user_id) select id, ${context.userId} from created returning room_id as id`;
    if (!rows[0]) throw new Error("Maksimal 10 ruang per akun.");
    return rows[0];
  });

const roomInput = z.object({ roomId: z.string().uuid() });
export const joinRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(roomInput)
  .handler(async ({ context, data }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    const rows = await sql<{ id: string }>`insert into study_members (room_id, user_id)
      select id, ${context.userId} from study_rooms where id = ${data.roomId}
      on conflict do nothing returning room_id as id`;
    if (!rows[0]) {
      const existing =
        await sql`select 1 from study_members where room_id = ${data.roomId} and user_id = ${context.userId}`;
      if (!existing[0]) throw new Error("Ruang tidak ditemukan.");
    }
    return { ok: true };
  });

export const getRoom = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(roomInput)
  .handler(async ({ context, data }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    const [room] = await sql<{ id: string; name: string; topic_id: string; owner_id: string }>`
      select r.id, r.name, r.topic_id, r.owner_id from study_rooms r
      join study_members m on m.room_id = r.id where r.id = ${data.roomId} and m.user_id = ${context.userId}`;
    if (!room) throw new Error("Gabung ruang untuk membaca diskusi.");
    const messages = await sql<{
      id: string;
      user_id: string;
      body: string;
      name: string;
      created_at: string;
    }>`
      select m.id, m.user_id, m.body, u.name, m.created_at::text from study_messages m
      join "user" u on u.id = m.user_id where m.room_id = ${room.id}
      order by m.created_at desc, m.id desc limit 100`;
    const members = await sql<{ id: string; name: string }>`select u.id, u.name from study_members m
      join "user" u on u.id = m.user_id where m.room_id = ${room.id} order by m.joined_at limit 100`;
    return { room, messages: messages.reverse(), members };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(roomInput.extend({ body: z.string().trim().min(1).max(2000) }))
  .handler(async ({ context, data }) => {
    const { getSql } = await import("./db");
    const { randomUUID } = await import("node:crypto");
    const sql = await getSql();
    const rows = await sql`insert into study_messages (id, room_id, user_id, body)
      select ${randomUUID()}, room_id, user_id, ${data.body} from study_members
      where room_id = ${data.roomId} and user_id = ${context.userId}
      and (select count(*) from study_messages where user_id = ${context.userId}
        and created_at > now() - interval '1 minute') < 20 returning id`;
    if (!rows[0])
      throw new Error("Pesan belum terkirim. Pastikan sudah bergabung atau tunggu satu menit.");
    return { ok: true };
  });

export const removeMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(roomInput.extend({ messageId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { getSql } = await import("./db");
    const sql = await getSql();
    await sql`delete from study_messages m where m.id = ${data.messageId} and m.room_id = ${data.roomId}
      and (m.user_id = ${context.userId} or exists(select 1 from study_rooms r
        where r.id = m.room_id and r.owner_id = ${context.userId}))`;
    return { ok: true };
  });
