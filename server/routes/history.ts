import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/history - 获取浏览历史
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("history")
      .select("recipe_id, viewed_at, recipes(*)")
      .eq("user_id", req.userId!)
      .order("viewed_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const formatted = (data || []).map((h: any) => {
      const r = h.recipes;
      if (!r) return null;
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        image: r.image,
        tags: r.tags || [],
        time: r.time,
        difficulty: r.difficulty,
        calories: r.calories,
        recommendationReason: r.recommendation_reason,
        matchPercentage: r.match_percentage,
        inventoryMatch: r.inventory_match,
        ingredients: {
          have: r.ingredients_have || [],
          missing: r.ingredients_missing || [],
        },
        steps: r.steps || [],
      };
    }).filter(Boolean);

    res.json(formatted);
  } catch (err: any) {
    console.error("GET /api/history error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history - 记录浏览（upsert）
router.post("/", async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      res.status(400).json({ error: "recipeId is required" });
      return;
    }

    const { error } = await supabase
      .from("history")
      .upsert(
        { user_id: req.userId!, recipe_id: recipeId, viewed_at: new Date().toISOString() },
        { onConflict: "user_id,recipe_id" }
      );

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error("POST /api/history error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history - 清空历史
router.delete("/", async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from("history")
      .delete()
      .eq("user_id", req.userId!);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/history error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history/cooking-records - 保存烹饪记录（照片+心得）
router.post("/cooking-records", async (req: Request, res: Response) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      res.status(400).json({ error: "records array is required" });
      return;
    }

    // 保存到 cooking_records 表（如果存在）
    for (const record of records) {
      try {
        await supabase
          .from("cooking_records")
          .insert({
            user_id: req.userId!,
            recipe_id: record.recipeId,
            recipe_name: record.recipeName,
            note: record.note || null,
            photo: record.photo || null,
            cooked_at: new Date().toISOString(),
          });
      } catch (e) {
        // 表不存在时静默忽略
        console.log("cooking_records insert skipped:", (e as any).message);
      }
    }

    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error("POST /api/history/cooking-records error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
