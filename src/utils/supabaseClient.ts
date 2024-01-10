import { createClient } from "@supabase/supabase-js";
import { appConstants } from "./appConstants";

export const supabaseClient = createClient(
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY,
);
