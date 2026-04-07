/**
 * 食材模糊匹配工具
 * 解决 "柠檬汁" vs "柠檬"、"五花肉" vs "猪肉" 等近义匹配问题
 */

// 食材等价/包含关系映射（库存名 → 可匹配的食材名）
const INGREDIENT_ALIASES: Record<string, string[]> = {
  "猪肉": ["五花肉", "猪里脊", "猪肉末", "猪肉丁", "猪肉馅", "猪排骨", "排骨", "肉丁", "肉末", "肉片", "肉丝"],
  "牛肉": ["牛腩", "牛里脊", "牛肉末", "牛肉丝", "牛肉丁", "牛肉片", "肥牛", "肥牛卷"],
  "鸡肉": ["鸡胸肉", "鸡腿", "鸡腿排", "鸡翅", "鸡翅中", "鸡全翅"],
  "鱼": ["鲈鱼", "鳕鱼", "鱼头", "鱼片", "鱼肉"],
  "虾": ["虾仁", "大虾", "明虾"],
  "威士忌": ["波本威士忌", "苏格兰威士忌"],
  "柠檬": ["柠檬汁", "柠檬片", "青柠", "青柠汁"],
  "酱油": ["生抽", "老抽", "蒸鱼豉油"],
  "辣椒": ["干辣椒", "青椒", "红椒", "尖椒", "小米辣"],
  "糖": ["白砂糖", "冰糖", "红糖", "黑糖", "细砂糖"],
  "醋": ["白醋", "陈醋", "香醋", "米醋"],
  "面粉": ["中筋面粉", "低筋面粉", "高筋面粉"],
  "奶油": ["淡奶油", "黄油"],
  "豆腐": ["嫩豆腐", "老豆腐", "豆腐块"],
  "米": ["大米", "寿司米"],
  "米饭": ["大米"],
  "蒜": ["蒜末", "蒜瓣", "蒜片"],
  "姜": ["姜片", "姜丝", "姜末"],
  "葱": ["小葱", "葱花", "葱段", "葱丝"],
  "橙子": ["橙汁", "橙片"],
  "芒果": ["芒果丁", "芒果块"],
  "牛奶": ["纯牛奶", "全脂牛奶"],
};

/**
 * 判断库存食材是否能匹配菜谱所需食材
 * @param inventoryName 库存中的食材名
 * @param recipeName 菜谱需要的食材名
 * @returns 是否匹配
 */
export function ingredientMatch(inventoryName: string, recipeName: string): boolean {
  // 1. 精确匹配
  if (inventoryName === recipeName) return true;

  // 2. 包含匹配（双向）：柠檬 ⊂ 柠檬汁、威士忌 ⊂ 波本威士忌
  if (recipeName.includes(inventoryName) || inventoryName.includes(recipeName)) return true;

  // 3. 等价映射匹配
  const aliases = INGREDIENT_ALIASES[inventoryName];
  if (aliases && aliases.includes(recipeName)) return true;

  return false;
}

/**
 * 检查菜谱食材是否在用户库存中（模糊匹配）
 * @param ingredientName 菜谱食材名
 * @param inventoryNames 用户库存食材名列表
 * @returns 是否匹配到库存
 */
export function isInInventory(ingredientName: string, inventoryNames: string[]): boolean {
  return inventoryNames.some(inv => ingredientMatch(inv, ingredientName));
}
