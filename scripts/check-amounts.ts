import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const s = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  // 用户库存中的食材
  const { data: inv } = await s.from("ingredients").select("name,amount").limit(30);
  console.log("=== 库存食材 ===");
  inv?.forEach((i: any) => console.log(`  ${i.name} | ${i.amount}`));

  // 菜谱中的食材
  const { data: recipes } = await s.from("recipes").select("name,ingredients_have,ingredients_missing").limit(5);
  console.log("\n=== 菜谱食材 ===");
  recipes?.forEach((r: any) => {
    console.log(`\n--- ${r.name} ---`);
    r.ingredients_have?.forEach((i: any) => console.log(`  HAVE: ${i.name} | ${i.amount}`));
    r.ingredients_missing?.forEach((i: any) => console.log(`  MISS: ${i.name} | ${i.amount}`));
  });
}

main();
