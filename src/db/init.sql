create table jokes (
  id              uuid default gen_random_uuid() primary key,
  setup           text not null,
  punchline       text,
  active_date     date,
  created_at      timestamp with time zone default timezone('utc'::text, now())
);

alter table jokes enable row level security;

create policy "Allow public read-only access." on jokes for select using (true);

--

create table submissions (
    id            uuid default gen_random_uuid() primary key,
    joke_id       uuid not null references jokes(id),
    user_id       uuid not null references auth.users,
    setup         text not null,
    punchline     text not null,
    status        text,
    feedback      jsonb,
    created_at    timestamp with time zone default timezone('utc'::text, now())
);

alter table submissions enable row level security;

create policy "Allow public read-only access." on submissions for select using (true);
create policy "Can insert own user jokes data." on submissions for insert to authenticated with check (auth.uid() = user_id);
create policy "Can update own user jokes data." on submissions for update using (auth.uid() = user_id);
create policy "Can delete own user jokes data." on submissions for delete using (auth.uid() = user_id);

---

create table votes (
    id            uuid default gen_random_uuid() primary key,
    submission_id uuid not null references submissions(id),
    user_id       uuid not null references auth.users,
    rating        text,
    created_at    timestamp with time zone default timezone('utc'::text, now())
);

-- prevent duplicate votes
create unique index votes_submission_user_idx on votes (submission_id, user_id);

alter table votes enable row level security;

create policy "Allow public read-only access." on votes for select using (true);
create policy "Can insert own votes." on votes for insert to authenticated with check (auth.uid() = user_id);
create policy "Can update own votes." on votes for update using (auth.uid() = user_id);
create policy "Can delete own votes." on votes for delete using (auth.uid() = user_id);

---