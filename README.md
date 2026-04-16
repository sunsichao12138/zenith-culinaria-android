<div align="center">

# 🍳 MenuMind

**AI 驱动的智能厨房助手 — 让冰箱告诉你今天吃什么**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)

</div>

---

## 📖 项目简介

MenuMind 是一款 **AI 驱动的智能厨房助手**，根据用户冰箱中的真实食材库存，结合个人口味偏好和忌口设置，通过 **两阶段 AI 推荐算法**（本地规则预筛 + 大模型精排）智能推荐菜谱，并支持一键烹饪、自动扣减库存的完整闭环。

### 🎯 核心理念

> 市面上的菜谱产品都是 **"人找菜谱"**，MenuMind 实现的是 **"菜谱找人"**——基于用户真实库存和个人偏好，由 AI 主动推荐最合适的菜谱。

### ❓ 解决的核心问题

| 痛点 | 解决方案 |
|-----|---------|
| 😩 每天纠结"今天吃什么" | AI 根据库存 + 偏好主动推荐 |
| 🗑️ 食材过期浪费 | 临期食材优先推荐，5 倍权重加成 |
| 📝 食材录入太麻烦 | AI 拍照识别，一键入库 |
| 🤔 不知道手上食材能做什么 | 智能食材-菜谱匹配（模糊匹配 + 等价映射） |
| ⚖️ 做完菜不知道用了多少 | 智能单位换算，自动扣减库存 |

---

## ✨ 功能特性

### 🤖 AI 智能推荐（核心功能）

- **两阶段推荐架构**：本地规则引擎毫秒级预筛 Top 20 → AI 大模型精排 Top 5
- **个性化推荐理由**：AI 根据用户库存和偏好生成定制化推荐语
- **临期优先策略**：快过期食材自动获得最高 5 倍权重，减少食物浪费
- **三级降级保障**：AI 精排 → 规则引擎兜底 → 完整生成模式，确保 100% 有结果
- **智能场景标签**：支持"来点甜的""快速搞定""深夜食堂"等情绪化快捷入口

### 📸 AI 视觉识别

- **拍照识别食材**：拍一张照片自动识别食材名称、分类、数量、单位和保质期
- **图片智能压缩**：Canvas API 压缩至 800px + 70% 质量，快速传输
- **优雅降级**：Capacitor 原生相机不可用时自动降级为 HTML 文件选择

### 🧊 冰箱管理

- **10 大分类 + 临期特殊分类**：蔬菜、水果、蛋奶肉类、海鲜水产、主食干货等
- **动态保质期倒计时**：实时计算剩余天数，自动标注临期/过期状态
- **灵活数量调节**：±1 快捷按钮 + 手动输入 + 自动清理（≤0 自动删除）
- **实时搜索过滤**：前端即时响应的食材搜索

### 📅 用餐计划

- **完整决策闭环**：推荐 → 加入计划 → 勾选烹饪 → 确认消耗 → 库存更新
- **缺失食材提醒**：实时计算所选菜品的缺失食材，辅助购物决策
- **智能单位换算引擎**：支持同单位、跨单位、跨量纲（密度换算）、模糊量词处理
- **消耗确认弹窗**：展示每种食材的消耗详情，支持手动调整

### 👤 个性化体验

- **忌口设置**：葱、姜、蒜、香菜、辣椒、花椒等，AI 推荐自动排除
- **口味偏好**：清淡、麻辣、酸甜、咸鲜、浓郁，影响推荐权重
- **头像 & 昵称**：个性化用户资料
- **收藏 & 历史**：菜谱收藏和浏览历史管理

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    客户端 (React SPA)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  首页     │ │  冰箱     │ │  计划     │ │  个人     │   │
│  │  Home    │ │  Fridge  │ │  Plan    │ │  Profile │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       └────────────┼───────────┼───────────┘           │
│              ┌─────┴─────┐                              │
│              │ API Client │ ← 自动携带 JWT Token         │
│              └─────┬─────┘                              │
├────────────────────┼────────────────────────────────────┤
│                    │ HTTP + Bearer Token                 │
├────────────────────┼────────────────────────────────────┤
│               后端 (Express)                             │
│  ┌─────────────────┴──────────────────┐                 │
│  │         Auth Middleware            │                 │
│  │       JWT Token 验证               │                 │
│  └─────────────────┬──────────────────┘                 │
│  ┌────┬────┬───┬───┴──┬────┬────┬────┬────┐            │
│  │auth│ingr│rec│  ai  │fav │plan│hist│prof│            │
│  └────┴──┬─┴───┴──┬───┴────┴────┴────┴────┘            │
│          │        │                                     │
│  ┌───────┴──┐ ┌───┴──────────┐                          │
│  │unitConv. │ │ingredientMatch│ ← 模糊匹配 + 等价映射    │
│  └──────────┘ └──────────────┘                          │
├─────────────────────────────────────────────────────────┤
│  外部服务                                                │
│  ┌──────────────┐    ┌─────────────────┐                │
│  │   Supabase   │    │  豆包大模型 Ark  │                │
│  │ PostgreSQL   │    │  推荐 + Vision  │                │
│  │   + Auth     │    │                 │                │
│  └──────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| **前端框架** | React 19 + TypeScript | SPA 单页应用 |
| **构建工具** | Vite 6 | 极速 HMR，开发代理 |
| **样式** | TailwindCSS 4 | 原子化 CSS |
| **动画** | Motion (Framer Motion) | 页面切换、卡片交互动效 |
| **路由** | React Router v7 (HashRouter) | 兼容 Capacitor |
| **状态管理** | React Context | Auth / Plan / Favorites / History |
| **后端** | Express 4 + TypeScript | RESTful API |
| **数据库** | Supabase (PostgreSQL) | BaaS: Auth + Database |
| **AI** | 豆包大模型 (Ark API) | 菜谱推荐 + 图像识别 |
| **移动端** | Capacitor 8 | Web → Android APK |
| **部署** | Vercel Serverless | 前端 + API 一体化 |

---

## 📁 项目结构

```
zenith-culinaria/
├── src/                          # 前端源码
│   ├── api/client.ts             # API 请求封装（自动携带 Token）
│   ├── context/                  # 全局状态管理
│   │   ├── AuthContext.tsx        #   用户认证
│   │   ├── PlanContext.tsx        #   用餐计划
│   │   ├── FavoritesContext.tsx   #   收藏管理
│   │   └── HistoryContext.tsx     #   浏览历史
│   ├── pages/                    # 页面组件
│   │   ├── Home.tsx              #   首页（推荐入口 + 快捷标签）
│   │   ├── Fridge.tsx            #   冰箱管理
│   │   ├── Filters.tsx           #   AI 推荐筛选页
│   │   ├── DishDetail.tsx        #   菜谱详情
│   │   ├── Plan.tsx              #   用餐计划 + 烹饪执行
│   │   ├── Profile.tsx           #   个人中心
│   │   ├── AddIngredient.tsx     #   添加食材（含 AI 拍照识别）
│   │   ├── Auth.tsx              #   登录/注册
│   │   └── SetupProfile.tsx      #   首次偏好设置
│   ├── components/Layout.tsx     # 底部导航栏布局
│   ├── lib/supabase.ts           # Supabase 客户端
│   ├── types.ts                  # TypeScript 类型定义
│   └── App.tsx                   # 路由配置 + 路由守卫
│
├── server/                       # 后端源码
│   ├── index.ts                  # 服务入口
│   ├── app.ts                    # Express 配置 + 中间件
│   ├── supabase.ts               # Supabase Admin 客户端
│   ├── middleware/auth.ts        # JWT 认证中间件
│   ├── routes/
│   │   ├── ai.ts                 # ⭐ AI 推荐 + 图像识别（核心逻辑）
│   │   ├── ingredients.ts        # 食材 CRUD + 消耗扣减
│   │   ├── recipes.ts            # 菜谱查询 + 库存匹配
│   │   ├── auth.ts               # 用户注册
│   │   ├── favorites.ts          # 收藏管理
│   │   ├── plans.ts              # 用餐计划
│   │   ├── history.ts            # 浏览历史
│   │   └── profile.ts            # 用户偏好
│   └── utils/
│       ├── unitConversion.ts     # ⭐ 智能单位换算引擎
│       └── ingredientMatch.ts    # ⭐ 食材模糊匹配
│
├── supabase/migrations/          # 数据库迁移
│   ├── 001_init.sql              # 初始表结构（6 张表）
│   └── 002_add_user_id.sql       # 多用户隔离
│
├── android/                      # Capacitor Android 工程
├── capacitor.config.ts           # Capacitor 配置
├── vercel.json                   # Vercel 部署配置
├── vite.config.ts                # Vite 构建配置
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** >= 9
- Supabase 项目（免费额度即可）
- 豆包大模型 API Key（[火山方舟平台](https://www.volcengine.com/product/ark)）

### 1. 克隆项目

```bash
git clone https://github.com/your-username/zenith-culinaria.git
cd zenith-culinaria
npm install
```

### 2. 配置环境变量

复制 `.env.local` 并填入你的密钥：

```env
# Supabase（前端）
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase（后端 - Service Role Key）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 豆包大模型 AI
ARK_API_KEY=your-ark-api-key
ARK_MODEL_ID=your-model-id
ARK_API_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3

# API 地址
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. 初始化数据库

在 Supabase 控制台的 SQL Editor 中依次执行：
- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_add_user_id.sql`
- `supabase/seed.sql`（种子数据）

### 4. 启动开发服务器

```bash
# 前端（端口 5173）
npm run dev

# 后端（端口 3001，新开一个终端）
npm run server
```

打开 http://localhost:5173 即可访问。

### 5. 构建 Android APK（可选）

```bash
npm run build
npx cap sync android
npx cap open android    # 使用 Android Studio 打开并构建
```

---

## 📊 数据库设计

共 **6 张核心表**：

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `ingredients` | 食材库存 | name, amount, expiry_days, category, user_id |
| `recipes` | 菜谱 | name, tags[], ingredients_have (JSONB), ingredients_missing (JSONB), steps[] |
| `favorites` | 收藏 | user_id, recipe_id (UNIQUE) |
| `meal_plans` | 用餐计划 | user_id, recipe_id (UNIQUE) |
| `history` | 浏览历史 | user_id, recipe_id, viewed_at |
| `user_profiles` | 用户偏好 | restrictions[], taste_preferences[], display_name |

---

## 🔑 核心算法

### AI 两阶段推荐

```
Stage 1 — 本地规则引擎（毫秒级）
├── 硬筛：烹饪时间过滤 + 忌口过滤
├── 评分：场景标签 + 库存匹配（临期 ×5 权重）+ 口味偏好
└── 输出：Top 20 候选

Stage 2 — AI 大模型精排（2-5 秒）
├── 输入：Top 20 + 用户完整库存 + 偏好
├── 处理：AI 综合统筹、挑选最优 5 道、生成推荐理由
└── 输出：Top 5 精选 + 个性化推荐语

降级策略：
├── AI 超时(40s) → 直接展示 Stage 1 Top 10（用户无感知）
└── 候选不足 3 道 → 切换 AI 完整生成模式
```

### 食材模糊匹配（三级策略）

```
Level 1：精确匹配   "鸡蛋" === "鸡蛋"
Level 2：包含匹配   "柠檬" ⊂ "柠檬汁"  ✓
Level 3：等价映射   "猪肉" ↔ ["五花肉", "猪里脊", "肉丝", "排骨"]
```

### 智能单位换算引擎

```
Case 1：同单位     500g − 200g = 300g
Case 2：可换算     1kg − 200g → 1000g − 200g = 800g
Case 3：密度换算   500g酱油 − 1勺 → 1勺=15ml, 酱油密度1.1g/ml → 500g − 16.5g
Case 4：模糊量词   "少许" → 2g, "适量" → 5g
Case 5：不可换算   跳过，不扣减（宁少扣不错扣）
Case 6：扣至零     自动删除该食材
```

---

## 🌐 部署

项目已配置 Vercel 一键部署：

```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/index.ts": { "maxDuration": 60 }
  }
}
```

在 Vercel 中导入仓库后，配置环境变量即可自动部署。

---

## 📄 License

MIT License

---

<div align="center">

**Made with ❤️ and AI**

</div>
