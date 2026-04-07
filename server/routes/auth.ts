import { Router, Request, Response } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// POST /api/auth/signup - 使用 admin API 创建已确认的用户
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "邮箱和密码不能为空" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "密码至少需要 6 个字符" });
      return;
    }

    // 使用 service role key 创建用户，自动确认邮箱
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 自动确认邮箱
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        res.status(409).json({ error: "该邮箱已注册，请直接登录" });
      } else {
        res.status(400).json({ error: error.message });
      }
      return;
    }

    console.log(`[Auth] New user created: ${data.user.email} (${data.user.id})`);
    res.status(201).json({ success: true, userId: data.user.id });
  } catch (err: any) {
    console.error("POST /api/auth/signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
