// ─────────────────────────────────────────────
// /tag-picks 快速标签推荐：召回 → 排序（跳过 LLM 精排）
// 延迟目标 < 500ms
// ─────────────────────────────────────────────

import type { FinalRecipe } from "./types.js";
import { loadUserContext, buildFilters, applyHardFilters } from "./context.js";
import {
  runRecall,
  sceneChannel,
  tasteChannel,
  inventoryChannel,
} from "./recall/index.js";
import { mergeAndRank } from "./ranking.js";
import { formatFinalRecipe } from "./format.js";
import { buildRecommendReason, getTimeSlotTags, getSceneTags } from "./shared.js";

const LIMIT = 10;

export interface TagPicksInput {
  userId: string;
  tag: string; // 前端标签文本，如 "家常菜"、"此刻推荐"
}

export async function runTagPicks(input: TagPicksInput): Promise<FinalRecipe[]> {
  const t0 = Date.now();

  // 「此刻推荐」特殊处理：使用时段标签
  let mealType = input.tag;
  if (input.tag === "此刻推荐") {
    const hour = new Date().getHours();
    const { tags } = getTimeSlotTags(hour);
    // 用时段标签中的第一个作为场景
    mealType = tags[0] || "家常菜";
  }

  const { ctx, allRecipes } = await loadUserContext(input.userId);
  const filters = buildFilters({
    userId: input.userId,
    mealType,
    useInventory: true,
    peopleCount: "2人",
    prepTime: "60分钟内", // 宽松时间限制
    tastePreference: "",
  });

  const t1 = Date.now();

  // 硬筛
  const universe = applyHardFilters(allRecipes, ctx, filters);

  // 多路召回
  const merged = runRecall(universe, ctx, filters, [
    sceneChannel,
    tasteChannel,
    inventoryChannel,
  ]);

  // 排序 Top-N（不走 LLM）
  const ranked = mergeAndRank(universe, merged, {
    topN: LIMIT,
    enforceSceneFilter: true,
  });

  const t2 = Date.now();

  // 如果场景完全不匹配，放宽场景约束再试
  let candidates = ranked.topCandidates;
  if (candidates.length < 3 && ranked.bestSceneTagHits === 0) {
    const relaxed = mergeAndRank(universe, merged, {
      topN: LIMIT,
      enforceSceneFilter: false,
    });
    candidates = relaxed.topCandidates;
  }

  // 拼装结果 + 模板理由
  const results: FinalRecipe[] = candidates.slice(0, LIMIT).map((s) => {
    const r = s.recipe;
    const haveNames = (r.ingredients_have || [])
      .filter((ing: any) => ctx.inventoryNames.includes(ing.name))
      .map((ing: any) => ing.name);
    const reason = buildRecommendReason(
      r.name,
      r.description || "",
      haveNames,
      r.tags || []
    );
    return formatFinalRecipe({
      recipe: r,
      inventoryNames: ctx.inventoryNames,
      recommendationReason: reason,
    });
  });

  const t3 = Date.now();
  console.log(
    `[TagPicks][Perf] tag="${input.tag}" DB:${t1 - t0}ms Rank:${t2 - t1}ms Format:${t3 - t2}ms TOTAL:${t3 - t0}ms → ${results.length} recipes`
  );

  return results;
}
