create table if not exists "rateLimit" (
  "id" text primary key,
  "key" text not null unique,
  "count" integer not null,
  "lastRequest" bigint not null
);

create table if not exists learning_progress (
  user_id text primary key references "user"(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists study_rooms (
  id text primary key,
  name text not null check (char_length(name) between 3 and 80),
  topic_id text not null,
  owner_id text not null references "user"(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists study_members (
  room_id text not null references study_rooms(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create index if not exists study_members_user_idx on study_members(user_id);
create table if not exists study_messages (
  id text primary key,
  room_id text not null references study_rooms(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists study_messages_room_idx on study_messages(room_id, created_at desc);
