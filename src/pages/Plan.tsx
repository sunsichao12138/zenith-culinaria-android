import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Sparkles, Clock, Plus, Check, Trash2, Refrigerator, PackageMinus, X, ChefHat, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePlan } from "../context/PlanContext";
import { cn } from "../lib/utils";
import { Recipe } from "../types";
import { api } from "../api/client";

export default function Plan() {
  const navigate = useNavigate();
  const { plannedRecipes, removeFromPlan, addToPlan, isInPlan } = usePlan();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);

  // 从 API 加载推荐菜谱
  useEffect(() => {
    api.get<Recipe[]>("/recipes")
      .then(setSuggestedRecipes)
      .catch((err) => console.error("Failed to load recipes:", err));
  }, []);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === plannedRecipes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(plannedRecipes.map(r => r.id));
    }
  };

  const handleStartCooking = () => {
    setShowConsumeModal(true);
  };

  const confirmConsumption = () => {
    // 实际业务中应在这里调用扣除食材接口，现在仅从计划中移除
    selectedIds.forEach(id => removeFromPlan(id));
    setSelectedIds([]);
    setShowConsumeModal(false);
  };

  const selectedRecipes = plannedRecipes.filter(r => selectedIds.includes(r.id));
  const haveIngredients = selectedRecipes.flatMap(r => r.ingredients.have);
  const missingIngredients = selectedRecipes.flatMap(r => r.ingredients.missing);
  
  // 简易聚合合并同名食材（展示用）
  const aggregateIngredients = (ings: any[]) => {
    const map = new Map<string, string>();
    ings.forEach(i => {
      // 若原先有值，可以累加处理；这里简单展示最新值
      if (i.name) map.set(i.name, i.amount || "适量");
    });
    return Array.from(map.entries()).map(([name, amount]) => ({ name, amount }));
  };

  const aggregatedHave = aggregateIngredients(haveIngredients);
  const aggregatedMissing = aggregateIngredients(missingIngredients);

  return (
    <div className="px-6 py-12 space-y-8 animate-in fade-in duration-500 pb-32">
      <section className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">今日计划</h1>
        {plannedRecipes.length > 0 && (
          <button 
            onClick={toggleSelectAll}
            className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2"
          >
            {selectedIds.length === plannedRecipes.length ? "取消全选" : "全选所有"}
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              selectedIds.length === plannedRecipes.length ? "bg-black border-black text-white" : "border-zinc-300"
            )}>
              {selectedIds.length === plannedRecipes.length ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
              )}
            </div>
          </button>
        )}
      </section>

      {plannedRecipes.length > 0 ? (
        <section className="space-y-4">
          <AnimatePresence mode="popLayout">
            {plannedRecipes.map((recipe) => (
              <motion.article
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className={cn(
                  "p-3 bg-white border rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer transition-all editorial-shadow relative group",
                  selectedIds.includes(recipe.id) ? "border-black ring-1 ring-black" : "border-zinc-100"
                )}
              >
                <div 
                  onClick={(e) => toggleSelect(recipe.id, e)}
                  className="flex-shrink-0"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedIds.includes(recipe.id) ? "bg-black border-black text-white" : "border-zinc-200"
                  )}>
                    {selectedIds.includes(recipe.id) && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="w-20 h-20 flex-shrink-0 bg-zinc-50 rounded-2xl overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col mb-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-bold text-zinc-900 truncate">{recipe.name}</h5>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-tight line-clamp-1">{recipe.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-[10px] text-zinc-400 font-medium">
                      <Clock size={12} className="mr-1" />
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlan(recipe.id);
                  }}
                  className="flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 w-8 h-8 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
              <Calendar size={40} className="text-zinc-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">计划表空空如也</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                您还没有选择任何菜品，去首页看看 AI 为您推荐了什么？
              </p>
            </div>
            <button 
              onClick={() => navigate("/filters")}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              <Sparkles size={18} />
              <span>去发现美味</span>
            </button>
          </div>
        </section>
      )}

      <section className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg">猜你喜欢</h4>
          <button 
            onClick={() => navigate("/")}
            className="text-zinc-400 text-xs font-bold flex items-center gap-1"
          >
            查看更多 <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {suggestedRecipes.slice(0, 6).map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-3xl p-3 border border-zinc-100 shadow-sm cursor-pointer group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-grow">
                  <h5 className="font-bold text-sm truncate">{recipe.name}</h5>
                  <span className="text-[10px] text-zinc-400">{recipe.time}</span>
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 flex-shrink-0 ${
                    isInPlan(recipe.id) ? "bg-zinc-100 text-zinc-400" : "bg-black text-white"
                  }`}
                >
                  {isInPlan(recipe.id) ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 固定底部按钮 - 始终显示 */}
      {plannedRecipes.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
          <button 
            onClick={handleStartCooking}
            disabled={selectedIds.length === 0}
            className={cn(
              "w-full py-5 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-3 transition-all",
              selectedIds.length > 0
                ? "bg-black text-white active:scale-95"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            )}
          >
            <ChefHat size={20} />
            <span>开始烹饪{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}</span>
          </button>
        </div>
      )}

      {/* Ingredient Consumption Modal */}
      <AnimatePresence>
        {showConsumeModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 sm:items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConsumeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl flex flex-col max-h-[85vh]"
            >
              <button 
                onClick={() => setShowConsumeModal(false)}
                className="absolute top-5 right-5 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="flex-shrink-0 text-center space-y-4 pt-4 pb-6 border-b border-zinc-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                  <Refrigerator className="text-blue-500" size={32} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">确认食材消耗</h2>
                  <p className="text-zinc-500 text-xs px-4">以下食材将会从您的冰箱库存中自动扣除。如果您还没有买到，不用担心，系统允许负库存。</p>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar px-1 py-6 space-y-6">
                {aggregatedHave.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      库中已有，将扣除
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {aggregatedHave.map((ing, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-zinc-50/80 rounded-2xl border border-zinc-100/50">
                          <span className="text-sm font-bold text-zinc-700 truncate mr-2">{ing.name}</span>
                          <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap bg-zinc-200/50 px-2 py-0.5 rounded-full">
                            - {ing.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aggregatedMissing.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      库中缺失，记为待购 / 负库存
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {aggregatedMissing.map((ing, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                          <span className="text-sm font-bold text-amber-900/80 truncate mr-2">{ing.name}</span>
                          <span className="text-[10px] text-amber-600 font-medium whitespace-nowrap bg-amber-100/50 px-2 py-0.5 rounded-full">
                            需 {ing.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aggregatedHave.length === 0 && aggregatedMissing.length === 0 && (
                  <div className="text-center py-8 text-zinc-400 text-sm">
                    此菜品没有需要记录的食材消耗
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 pt-4 border-t border-zinc-100">
                <button 
                  onClick={confirmConsumption}
                  className="w-full bg-black text-white py-4 rounded-full font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PackageMinus size={18} />
                  确认消耗并开始
                </button>
                <div className="text-center mt-3">
                  <button 
                    onClick={() => setShowConsumeModal(false)}
                    className="text-xs text-zinc-400 font-bold hover:text-zinc-600"
                  >
                    暂不开始
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
