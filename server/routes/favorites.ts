import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/favorites - 获取用户收藏列表（含菜谱详情）
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("recipe_id, created_at, recipes(*)")
      .eq("user_id", req.userId!)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map((fav: any) => {
      const r = fav.recipes;
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
    console.error("GET /api/favorites error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/favorites - 添加收藏
router.post("/", async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      res.status(400).json({ error: "recipeId is required" });
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .upsert({ user_id: req.userId!, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error("POST /api/favorites error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/favorites/:recipeId - 取消收藏
router.delete("/:recipeId", async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", req.userId!)
      .eq("recipe_id", recipeId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/favorites error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
