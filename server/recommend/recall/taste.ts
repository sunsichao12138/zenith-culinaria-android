// ─────────────────────────────────────────────
// 口味偏好召回：标签命中 boost +8 / penalize -10
// 只计算不在 sceneTags 中的标签，避免与场景通道重复计分
// ─────────────────────────────────────────────

import type { RecallChannel, RecallResult, UserContext, RequestFilters } from "../types.js";

export const tasteChannel: RecallChannel = {
  name: "taste",
  run(recipes: any[], _ctx: UserContext, filters: RequestFilters): RecallResult {
    const result: RecallResult = new Map();
    const { boost, penalize } = filters.tasteTags;
    if (boost.length === 0 && penalize.length === 0) return result;

    // 去除已在 sceneTags 中的标签，只保留 taste 独有的标签做加权
    const sceneSet = new Set(filters.sceneTags);
    const uniqueBoost = boost.filter((t: string) => !sceneSet.has(t));
    const uniquePenalize = penalize.filter((t: string) => !sceneSet.has(t));

    for (const r of recipes) {
      const tags: string[] = r.tags || [];
      let score = 0;
      for (const tag of tags) {
        if (uniqueBoost.includes(tag)) score += 8;
        if (uniquePenalize.includes(tag)) score -= 10;
      }
      if (score !== 0) {
        result.set(r.id, { score });
      }
    }
    return result;
  },
};

