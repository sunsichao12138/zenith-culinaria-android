import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// 保留新版（用户编写的带下划线的），删除旧版
const toDelete = [
  "seed_duojiaoyutou",    // 旧 剁椒鱼头
  "seed_gongbaojiding",   // 旧 宫保鸡丁
  "seed_chaofan",         // 旧 扬州炒饭
  "seed_zhajangmian",     // 旧 老北京炸酱面
  "seed_lajiachaorou",    // 旧 辣椒炒肉
  "seed_suanlatudousi",   // 旧 酸辣土豆丝（被 upsert 覆盖了，但 ID 不同）
  "seed_yuxiangrous",     // 旧 鱼香肉丝
  "seed_mapodoufu",       // 旧 麻婆豆腐
  "seed_heijiaoniupai",   // 旧 黑椒牛排
];

async function run() {
  for (const id of toDelete) {
    const { error } = await s.from("recipes").delete().eq("id", id);
    if (error) {
      console.log(`❌ 删除 ${id} 失败: ${error.message}`);
    } else {
      console.log(`✅ 删除旧版: ${id}`);
    }
  }

  const { count } = await s.from("recipes").select("*", { count: "exact", head: true });
  console.log(`\n数据库剩余: ${count} 道菜谱`);
}

run();
