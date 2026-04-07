import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/recipes - 获取全部菜谱
router.get("/", async (req: Request, res: Response) => {
  try {
    const { tag } = req.query;

    let query = supabase.from("recipes").select("*").order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    let result = data || [];

    // 标签过滤
    if (tag && typeof tag === "string") {
      result = result.filter((r: any) => r.tags && r.tags.includes(tag));
    }

    // 转换为前端格式
    const formatted = result.map(formatRecipe);
    res.json(formatted);
  } catch (err: any) {
    console.error("GET /api/recipes error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/:id - 获取菜谱详情
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.json(formatRecipe(data));
  } catch (err: any) {
    console.error("GET /api/recipes/:id error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recipes - 添加菜谱
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      id, name, description, image, tags, time, difficulty, calories,
      recommendationReason, matchPercentage, inventoryMatch,
      ingredients, steps,
    } = req.body;

    const { data, error } = await supabase
      .from("recipes")
      .insert({
        id: id || crypto.randomUUID().slice(0, 8),
        name,
        description: description || "",
        image: image || "",
        tags: tags || [],
        time: time || "",
        difficulty: difficulty || "",
        calories: calories || "",
        recommendation_reason: recommendationReason || "",
        match_percentage: matchPercentage || null,
        inventory_match: inventoryMatch || null,
        ingredients_have: ingredients?.have || [],
        ingredients_missing: ingredients?.missing || [],
        steps: steps || [],
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(formatRecipe(data));
  } catch (err: any) {
    console.error("POST /api/recipes error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

function formatRecipe(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    tags: row.tags || [],
    time: row.time,
    difficulty: row.difficulty,
    calories: row.calories,
    recommendationReason: row.recommendation_reason,
    matchPercentage: row.match_percentage,
    inventoryMatch: row.inventory_match,
    ingredients: {
      have: row.ingredients_have || [],
      missing: row.ingredients_missing || [],
    },
    steps: row.steps || [],
  };
}

export default router;
