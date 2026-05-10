import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, RefreshCw, Clock, Plus, Check, Heart, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePlan } from "../context/PlanContext";
import { useFavorites } from "../context/FavoritesContext";
import { cn } from "../lib/utils";
import { Recipe } from "../types";
import { api } from "../api/client";

const ALL_TAGS = [
  { label: "元气早餐", emoji: "🌞", slots: ["morning"] },
  { label: "低碳水", emoji: "🌿" },
  { label: "宝宝餐", emoji: "👶" },
  { label: "本周热点", emoji: "🔥" },
  { label: "15分钟快手", emoji: "⏱️", slots: ["morning", "lunch"] },
  { label: "拯救冰箱", emoji: "🧊" },
  { label: "来点甜的", emoji: "🍰", slots: ["afternoon"] },
  { label: "喝点东西", emoji: "🥤", slots: ["afternoon"] },
  { label: "家常菜", emoji: "🍳", slots: ["lunch", "dinner"] },
  { label: "西式料理", emoji: "🍝", slots: ["lunch", "dinner"] },
  { label: "日韩风味", emoji: "🍣", slots: ["lunch", "dinner"] },
  { label: "火辣过瘾", emoji: "🌶️", slots: ["lunch", "dinner", "night"] },
  { label: "清爽解腻", emoji: "🥗", slots: ["afternoon"] },
  { label: "高蛋白", emoji: "💪" },
  { label: "深夜食堂", emoji: "🌙", slots: ["night"] },
  { label: "减脂餐", emoji: "🥑", slots: ["morning", "lunch"] },
  { label: "微醺调酒", emoji: "🍸", slots: ["night"] },
];

// 根据时间获取当前时段
const getTimeSlot = (): string => {
  const h = new Date().getHours();
  if (h < 4) return "night";
  if (h < 11) return "morning";
  if (h < 14) return "lunch";
  if (h < 17) return "afternoon";
  if (h < 21) return "dinner";
  return "night";
};

// 生成时段感知的标签列表
const getTimeTags = () => {
  const slot = getTimeSlot();
  const slotTags = ALL_TAGS.filter(t => t.slots?.includes(slot));
  const generalTags = ALL_TAGS.filter(t => !t.slots);
  const otherTags = ALL_TAGS.filter(t => t.slots && !t.slots.includes(slot));

  return [
    ...slotTags.sort(() => 0.5 - Math.random()),
    ...generalTags.sort(() => 0.5 - Math.random()),
    ...otherTags.sort(() => 0.5 - Math.random()),
  ].slice(0, 6);
};

export default function Home() {
  const navigate = useNavigate();
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [currentTags, setCurrentTags] = useState(() => getTimeTags());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 标签推荐结果
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagRecipes, setTagRecipes] = useState<Recipe[]>([]);
  const [tagLoading, setTagLoading] = useState(false);

  const refreshTags = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentTags(getTimeTags());
      setIsRefreshing(false);
    }, 500);
  };

  // 点击标签 → 在页面内加载推荐
  const handleTagClick = (tagLabel: string) => {
    if (activeTag === tagLabel) {
      // 再次点击 → 取消选中，恢复默认
      setActiveTag(null);
      setTagRecipes([]);
      return;
    }

    setActiveTag(tagLabel);
    setTagLoading(true);
    setTagRecipes([]);

    api.post<Recipe[]>("/ai/recommend", {
      mealType: tagLabel,
      useInventory: true,
      peopleCount: "2人",
      prepTime: "30分钟内",
      tastePreference: "",
    })
      .then((data) => {
        setTagRecipes(data);
      })
      .catch((err) => {
        console.error("Tag recommend failed:", err);
        // 降级到全部菜品
        api.get<Recipe[]>("/recipes")
          .then((data) => setTagRecipes(data.slice(0, 5)))
          .catch(() => {});
      })
      .finally(() => setTagLoading(false));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 4) return "夜深了，来点宵夜犒劳下自己？ ✨";
    if (hour < 11) return "早上好，来份元气早餐吧 ☀️";
    if (hour < 14) return "中午好，该吃午饭啦 🍱";
    if (hour < 17) return "下午好，该吃下午茶了 ☕️";
    if (hour < 21) return "晚上好，准备好晚餐了吗 🌙";
    return "夜深了，来点宵夜犒劳下自己？ ✨";
  };

  return (
    <div className="px-5 pt-12 pb-12 space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">今日推荐</h1>
        <p className="text-on-surface-variant text-base mt-1 font-bold">{getGreeting()}</p>
      </section>

      {/* AI Recommendation Banner */}
      <section 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 shadow-sm px-4 py-3 cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => navigate("/filters")}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              <span className="text-[10px] tracking-wider uppercase font-bold text-primary/80">AI 智能推荐</span>
            </div>
            <h3 className="font-extrabold text-lg text-on-surface">今天吃什么？</h3>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate("/filters"); }}
            className="bg-gradient-to-r from-primary to-orange-500 text-white font-extrabold rounded-full px-5 py-2 text-sm shadow-md shadow-primary/25 active:scale-95 transition-transform whitespace-nowrap"
          >
            帮我选
          </button>
        </div>
      </section>

      {/* Quick Tags */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-base text-on-surface">你现在更想要</h4>
          <button 
            onClick={refreshTags}
            disabled={isRefreshing}
            className={cn(
              "text-on-surface-variant hover:text-primary p-1.5 rounded-full transition-all active:scale-90",
              isRefreshing && "animate-spin"
            )}
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <AnimatePresence mode="popLayout">
            {currentTags.map((tag) => (
              <motion.button
                key={tag.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => handleTagClick(tag.label)}
                className={cn(
                  "py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1 truncate border",
                  activeTag === tag.label
                    ? "bg-primary text-white shadow-md shadow-primary/25 border-primary"
                    : "bg-white text-on-surface border-orange-100/80 editorial-shadow hover:bg-orange-50/50"
                )}
              >
                <span className="text-sm">{tag.emoji}</span>
                <span className="truncate">{tag.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 推荐结果区域 */}
      <section className="space-y-3">
        <AnimatePresence mode="wait">
          {/* 标签加载中 */}
          {tagLoading && (
            <motion.div
              key="tag-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={20} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-bold text-on-surface">正在寻找「{activeTag}」...</p>
                <p className="text-xs text-on-surface-variant">AI 正在根据你的库存推荐</p>
              </div>
            </motion.div>
          )}

          {/* 标签推荐结果 */}
          {!tagLoading && activeTag && tagRecipes.length > 0 && (
            <motion.div
              key="tag-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-on-surface flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  「{activeTag}」推荐
                </h4>
                <button
                  onClick={() => { setActiveTag(null); setTagRecipes([]); }}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                {tagRecipes.map((recipe, index) => (
                  <motion.article
                    key={recipe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.08 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-orange-100/60 shadow-sm cursor-pointer hover:shadow-md transition-shadow editorial-shadow flex gap-3 p-2.5"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div className="flex items-center gap-1">
                        <h5 className="text-sm font-extrabold text-on-surface truncate flex-grow">{recipe.name}</h5>
                        {recipe.matchPercentage != null && recipe.matchPercentage > 0 && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">
                            {recipe.matchPercentage}%
                          </span>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(recipe);
                          }}
                          className={cn(
                            "p-0.5 rounded-full transition-all active:scale-90 flex-shrink-0",
                            isFavorite(recipe.id) ? "text-red-500" : "text-zinc-300 hover:text-zinc-400"
                          )}
                        >
                          <Heart size={16} fill={isFavorite(recipe.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-1">
                        {recipe.recommendationReason || recipe.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-[10px] text-on-surface-variant font-medium">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {recipe.time}
                          </span>
                          {(recipe.inventoryMatch ?? 0) > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Package size={10} />
                              {recipe.inventoryMatch}种食材
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInPlan(recipe.id)) {
                              removeFromPlan(recipe.id);
                            } else {
                              addToPlan(recipe);
                            }
                          }}
                          className={cn(
                            "flex-shrink-0 flex items-center justify-center rounded-full w-7 h-7 transition-all active:scale-90",
                            isInPlan(recipe.id) ? "bg-surface-container-low text-on-surface-variant" : "bg-primary text-white shadow-sm shadow-primary/30"
                          )}
                        >
                          {isInPlan(recipe.id) ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* 默认状态：未选标签时展示空提示 */}
          {!tagLoading && !activeTag && (
            <motion.div
              key="default-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                <Sparkles size={24} className="text-primary/40" />
              </div>
              <p className="text-on-surface-variant text-sm font-semibold">点击上方标签，获取 AI 推荐</p>
              <p className="text-on-surface-variant/60 text-xs mt-1">或点击「帮我选」进入详细筛选</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
