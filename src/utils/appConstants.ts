import { z } from "zod";
import { parseEnv } from "./parseEnv";

//env vars need to be explicitly typed to allow bundling
const envObject = {
  NEXT_PUBLIC_SUPABASE_PROJECT_URL:
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY,
};

export const appConstants = parseEnv(
  z.object({
    NEXT_PUBLIC_SUPABASE_PROJECT_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY: z.string(),
  }),
  "WEB APP",
  envObject,
);
