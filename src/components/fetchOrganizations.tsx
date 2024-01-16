import { supabaseClient } from "@/utils/supabaseClient";

export async function fetchAllOrganization() {
  const { data: organizations } = await supabaseClient
    .from("Organization")
    .select("*");

  return organizations || [];
}
