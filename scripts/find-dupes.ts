import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const { data } = await s.from("recipes").select("id, name").order("name");
  if (!data) return;

  // 按名称分组
  const groups: Record<string, any[]> = {};
  for (const r of data) {
    if (!groups[r.name]) groups[r.name] = [];
    groups[r.name].push(r);
  }

  // 找出重复的
  console.log("=== 重名菜谱 ===");
  let dupCount = 0;
  for (const [name, items] of Object.entries(groups)) {
    if (items.length > 1) {
      dupCount++;
      console.log(`\n${name} (${items.length}个):`);
      items.forEach(i => console.log(`  ${i.id}`));
    }
  }
  console.log(`\n共 ${dupCount} 组重名，总计 ${data.length} 道菜`);
}

run();
