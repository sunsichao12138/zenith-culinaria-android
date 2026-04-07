import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const uid = "64c96812-f753-4f7e-ab82-663ce9a8fb35";

  const { data: profile } = await s.from("user_profiles").select("*").eq("user_id", uid).single();
  console.log("=== 用户资料 ===");
  console.log("昵称:", profile?.display_name || "未设置");
  console.log("忌口:", JSON.stringify(profile?.restrictions || []));
  console.log("口味:", JSON.stringify(profile?.taste_preferences || []));

  const { data: ings } = await s.from("ingredients").select("name, amount, expiry_days").eq("user_id", uid);
  console.log("\n=== 库存食材 ===");
  if (ings && ings.length > 0) {
    ings.forEach((i: any) => console.log("  " + i.name + " (" + i.amount + ", " + i.expiry_days + "天)"));
  } else {
    console.log("  (空)");
  }

  const { data: recipes } = await s
    .from("recipes")
    .select("id, name, recommendation_reason, match_percentage, inventory_match, ingredients_have, ingredients_missing, created_at")
    .like("id", "ai_%")
    .order("created_at", { ascending: false })
    .limit(3);

  console.log("\n=== 最近一轮AI推荐 ===");
  for (const r of recipes || []) {
    const have = (r.ingredients_have || []).map((i: any) => i.name).join(", ");
    const miss = (r.ingredients_missing || []).map((i: any) => i.name).join(", ");
    console.log("\n" + r.name + " (匹配" + r.match_percentage + "%)");
    console.log("  时间: " + r.created_at);
    console.log("  理由: " + r.recommendation_reason);
    console.log("  已有(" + r.inventory_match + "): " + (have || "无"));
    console.log("  缺少: " + miss);
  }
}

run();
