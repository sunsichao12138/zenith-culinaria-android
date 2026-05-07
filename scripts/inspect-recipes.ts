// 临时脚本：对比 DB 中的 seed_ 菜谱 与 seed-recipes.ts 里定义的，找出差异
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  // 无过滤拉全表
  const { data: allData, count } = await supabase
    .from("recipes")
    .select("id", { count: "exact" });
  console.log(`全表总条数(count): ${count}, 实际返回: ${allData?.length}`);
  const seedFromAll = (allData || []).filter((r) => r.id.startsWith("seed_")).length;
  const aiFromAll = (allData || []).filter((r) => r.id.startsWith("ai_")).length;
  console.log(`其中 seed_*: ${seedFromAll}, ai_*: ${aiFromAll}`);

  const { data, error } = await supabase
    .from("recipes")
    .select("id, name, tags, time")
    .like("id", "seed_%");

  if (error) {
    console.error("查询失败:", error.message);
    return;
  }
  if (!data) return;

  const dbIds = new Set(data.map((r) => r.id));
  console.log(`DB 中 seed_* 菜谱: ${dbIds.size} 道`);

  const scriptContent = fs.readFileSync("scripts/seed-recipes.ts", "utf-8");
  const scriptIds = new Set<string>();
  const idMatches = scriptContent.matchAll(/id:"(seed_[^"]+)"/g);
  for (const m of idMatches) {
    scriptIds.add(m[1]);
  }
  console.log(`seed-recipes.ts 里定义: ${scriptIds.size} 道`);

  console.log("\n═══ 在 DB 但不在脚本里的（重跑 seed 会被删掉）═══");
  const missingInScript = data
    .filter((r) => !scriptIds.has(r.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const r of missingInScript) {
    console.log(
      `  ${r.id.padEnd(30)} ${r.name.padEnd(20)} time=${r.time} tags=[${(r.tags || []).join(",")}]`
    );
  }
  console.log(`小计: ${missingInScript.length} 道`);

  console.log("\n═══ 在脚本但不在 DB（重跑 seed 后会新增）═══");
  for (const id of scriptIds) {
    if (!dbIds.has(id)) console.log(`  ${id}`);
  }

  console.log("\n═══ 模拟「汤类 + 30 分钟 + 排除 ai_」召回 ═══");
  const sceneTags = ["汤", "汤羹", "汤品", "炖菜", "煲汤", "羹"];
  const parseMin = (t: string) => {
    const m = (t || "").match(/(\d+)/);
    return m ? parseInt(m[1]) : 30;
  };
  const filtered = data.filter((r) => {
    if (parseMin(r.time) > 30) return false;
    return (r.tags || []).some((t: string) => sceneTags.includes(t));
  });
  filtered.sort((a, b) => parseMin(a.time) - parseMin(b.time));
  for (const r of filtered) {
    console.log(`  ${r.name.padEnd(15)} ${r.time.padEnd(8)} [${(r.tags || []).join(",")}]`);
  }
  console.log(`合计 ${filtered.length} 道命中`);
}

run();
