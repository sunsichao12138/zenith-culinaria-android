import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const uid = "27db4f47-8a51-4a16-bfa1-cce02c06dcd7";

  const { data: ings } = await s.from("ingredients").select("name, amount, expiry_days").eq("user_id", uid);
  console.log("=== 库存 ===");
  console.log(JSON.stringify(ings, null, 2));

  const { data: recipes } = await s
    .from("recipes")
    .select("id, name, recommendation_reason, inventory_match, ingredients_have, ingredients_missing, created_at")
    .like("id", "ai_%")
    .order("created_at", { ascending: false })
    .limit(6);

  console.log("\n=== 最新AI推荐菜品 ===");
  for (const r of recipes || []) {
    const have = (r.ingredients_have || []).map((i: any) => i.name).join(", ");
    const miss = (r.ingredients_missing || []).map((i: any) => i.name).join(", ");
    console.log(`\n[${r.created_at}] ${r.name}`);
    console.log(`  理由: ${r.recommendation_reason}`);
    console.log(`  已有(${r.inventory_match}): ${have || "无"}`);
    console.log(`  缺少: ${miss}`);
  }
}

run();
