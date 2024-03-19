import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabase = createClient(supabaseUrl, supabaseKey);
