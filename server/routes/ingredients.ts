import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/ingredients - 获取全部食材
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from("ingredients").select("*").eq("user_id", req.userId!).order("created_at", { ascending: false });

    if (category && category !== "全部" && category !== "临期") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;

    let result = data || [];

    // 临期过滤（expiry_days <= 3）
    if (category === "临期") {
      result = result.filter((item: any) => item.expiry_days <= 3);
    }

    // 搜索过滤
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      result = result.filter((item: any) => item.name.toLowerCase().includes(q));
    }

    // 转换字段名为前端格式
    const formatted = result.map((item: any) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      expiryDays: item.expiry_days,
      category: item.category,
      image: item.image,
      suggestions: item.suggestions || [],
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("GET /api/ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ingredients - 添加食材
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, amount, expiryDays, category, image, suggestions } = req.body;

    const { data, error } = await supabase
      .from("ingredients")
      .insert({
        user_id: req.userId!,
        name,
        amount,
        expiry_days: expiryDays || 7,
        category: category || "其他",
        image: image || "",
        suggestions: suggestions || [],
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      name: data.name,
      amount: data.amount,
      expiryDays: data.expiry_days,
      category: data.category,
      image: data.image,
      suggestions: data.suggestions || [],
    });
  } catch (err: any) {
    console.error("POST /api/ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/ingredients/:id - 更新食材
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: any = {};

    if (req.body.amount !== undefined) updates.amount = req.body.amount;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.expiryDays !== undefined) updates.expiry_days = req.body.expiryDays;
    if (req.body.category !== undefined) updates.category = req.body.category;

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("ingredients")
      .update(updates)
      .eq("id", id)
      .eq("user_id", req.userId!)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: data.id,
      name: data.name,
      amount: data.amount,
      expiryDays: data.expiry_days,
      category: data.category,
      image: data.image,
      suggestions: data.suggestions || [],
    });
  } catch (err: any) {
    console.error("PATCH /api/ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/ingredients/:id - 删除食材
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("ingredients").delete().eq("id", id).eq("user_id", req.userId!);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
