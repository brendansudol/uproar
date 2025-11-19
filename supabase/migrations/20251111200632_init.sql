-- Clean slate
drop table if exists favorites cascade;
drop table if exists votes cascade;
drop table if exists submissions cascade;
drop table if exists jokes cascade;

-- -----------------------------
-- JOKES
-- -----------------------------
create table jokes (
  id          uuid primary key default gen_random_uuid(),
  setup       text not null,
  punchline   text,
  active_date date,
  commentary  jsonb,
  metadata    jsonb
);

alter table jokes enable row level security;

create policy "Allow public read-only access."
  on jokes for select
  using (true);

create index jokes_active_date_idx on jokes (active_date);

-- -----------------------------
-- SUBMISSIONS
-- -----------------------------
create table submissions (
  id          uuid primary key default gen_random_uuid(),
  joke_id     uuid not null references jokes(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  setup       text not null,
  punchline   text not null,
  status      text,
  analysis    jsonb,
  created_at  timestamptz not null default now()

  -- constraint submissions_user_joke_uniq unique (user_id, joke_id)
);

alter table submissions enable row level security;

create policy "Allow public read-only access."
  on submissions for select
  using (true);

create policy "Can insert own user jokes data."
  on submissions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Can update own user jokes data."
  on submissions for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Can delete own user jokes data."
  on submissions for delete to authenticated
  using (auth.uid() = user_id);

create index submissions_created_at_idx on submissions (created_at desc);
create index submissions_user_id_idx   on submissions (user_id);
create index submissions_joke_id_idx   on submissions (joke_id);

-- -----------------------------
-- VOTES (ratings on submissions)
-- -----------------------------
create table votes (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  score         smallint not null,
  created_at    timestamptz not null default now()

  -- constraint votes_submission_user_uniq unique (submission_id, user_id)
);

alter table votes enable row level security;

create policy "Allow public read-only access."
  on votes for select
  using (true);

create policy "Can insert own votes."
  on votes for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Can update own votes."
  on votes for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Can delete own votes."
  on votes for delete to authenticated
  using (auth.uid() = user_id);

create index votes_submission_id_idx on votes (submission_id);
create index votes_user_id_idx       on votes (user_id);

-- -----------------------------
-- FAVORITES (saved submissions)
-- -----------------------------
create table favorites (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null references submissions(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  created_at     timestamptz not null default now()

  -- constraint favorites_user_submission_uniq unique (user_id, submission_id)
);

alter table favorites enable row level security;

create policy "Allow public read-only access."
  on favorites for select
  using (true);

create policy "Can insert own favorites."
  on favorites for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Can delete own favorites."
  on favorites for delete to authenticated
  using (auth.uid() = user_id);

create index favorites_user_id_idx       on favorites (user_id);
create index favorites_submission_id_idx on favorites (submission_id);
