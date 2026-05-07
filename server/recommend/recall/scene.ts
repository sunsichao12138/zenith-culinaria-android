// ─────────────────────────────────────────────
// 场景标签召回：用户选的餐食类型 → 标签命中
// 匹配的菜谱给固定基础分，排序交给 taste/inventory
// ─────────────────────────────────────────────

import type { RecallChannel, RecallResult, UserContext, RequestFilters } from "../types.js";

export const sceneChannel: RecallChannel = {
  name: "scene",
  run(recipes: any[], _ctx: UserContext, filters: RequestFilters): RecallResult {
    const result: RecallResult = new Map();
    for (const r of recipes) {
      const tags: string[] = r.tags || [];
      let hits = 0;
      for (const tag of tags) {
        if (filters.sceneTags.includes(tag)) hits++;
      }
      // 同时计算合并标签命中（场景 + 口味 boost），用于硬筛兜底
      let combinedHits = 0;
      for (const tag of tags) {
        if (filters.combinedTags.includes(tag)) combinedHits++;
      }
      if (hits > 0 || combinedHits > 0) {
        // 固定基础分 10，不按命中数翻倍，让 taste/inventory 决定排序
        result.set(r.id, {
          score: hits > 0 ? 10 : 0,
          meta: { sceneTagHits: hits, combinedTagHits: combinedHits },
        });
      }
    }
    return result;
  },
};
