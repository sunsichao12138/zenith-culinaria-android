import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  const errMsg = "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables. Please set them in Vercel or .env";
  console.error(errMsg);
  // Do NOT process.exit(1) on Vercel, it kills the serverless function. 
  // Throwing an error is safer or just letting it fail on query.
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");
