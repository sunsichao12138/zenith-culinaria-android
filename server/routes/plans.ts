import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/plans - 获取用餐计划列表
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("meal_plans")
      .select("recipe_id, created_at, recipes(*)")
      .eq("user_id", req.userId!)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map((plan: any) => {
      const r = plan.recipes;
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
    console.error("GET /api/plans error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/plans - 添加到计划
router.post("/", async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      res.status(400).json({ error: "recipeId is required" });
      return;
    }

    const { error } = await supabase
      .from("meal_plans")
      .upsert({ user_id: req.userId!, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error("POST /api/plans error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/plans/:recipeId - 从计划中移除
router.delete("/:recipeId", async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("user_id", req.userId!)
      .eq("recipe_id", recipeId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/plans error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
