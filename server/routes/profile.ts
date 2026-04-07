import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// GET /api/profile - 获取用户配置
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", req.userId!)
      .single();

    if (error && error.code === "PGRST116") {
      // 不存在则创建默认配置
      const { data: newData, error: insertErr } = await supabase
        .from("user_profiles")
        .insert({
          user_id: req.userId!,
          display_name: "美食探险家",
          restrictions: ["葱", "姜"],
          taste_preferences: ["清淡"],
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      res.json(formatProfile(newData));
      return;
    }

    if (error) throw error;
    res.json(formatProfile(data));
  } catch (err: any) {
    console.error("GET /api/profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/profile - 更新偏好设置（如果不存在则创建）
router.patch("/", async (req: Request, res: Response) => {
  try {
    const updates: any = {};

    if (req.body.displayName !== undefined) updates.display_name = req.body.displayName;
    if (req.body.avatarUrl !== undefined) updates.avatar_url = req.body.avatarUrl;
    if (req.body.restrictions !== undefined) updates.restrictions = req.body.restrictions;
    if (req.body.tastePreferences !== undefined) updates.taste_preferences = req.body.tastePreferences;

    updates.updated_at = new Date().toISOString();

    // 先尝试更新
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", req.userId!)
      .select();

    if (error) throw error;

    // 如果没有匹配的行（新用户），则插入
    if (!data || data.length === 0) {
      const { data: newData, error: insertErr } = await supabase
        .from("user_profiles")
        .insert({
          user_id: req.userId!,
          display_name: updates.display_name || "美食探险家",
          avatar_url: updates.avatar_url || "",
          restrictions: updates.restrictions || [],
          taste_preferences: updates.taste_preferences || [],
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      res.json(formatProfile(newData));
      return;
    }

    res.json(formatProfile(data[0]));
  } catch (err: any) {
    console.error("PATCH /api/profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

function formatProfile(row: any) {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    level: row.level,
    points: row.points,
    restrictions: row.restrictions || [],
    tastePreferences: row.taste_preferences || [],
  };
}

export default router;
