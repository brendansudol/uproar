## misc notes

- to update db types: `npx supabase gen types --lang=typescript --project-id $PROJECT_ID > ./src/types/db.ts`
- enrich jokes script example: `pnpm enrich:jokes -- --input src/data/jokes.json --output src/data/jokes.enriched.json --model gpt-5.1.`
