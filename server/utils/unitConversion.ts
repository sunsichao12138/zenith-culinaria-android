/**
 * 食材单位智能解析与换算模块
 *
 * 处理中式烹饪中常见的模糊用量（少许、适量）和异构单位（勺 vs 克）问题。
 *
 * 策略:
 * 1. 标准化：将所有单位归一化到基础单位（克、毫升、个）
 * 2. 模糊量词：给"少许"、"适量"等分配合理的默认数值
 * 3. 换算：在同一量纲内做减法（质量对质量，体积对体积）
 * 4. 不可换算：不同量纲时（如库存"2瓶" vs 菜谱"1勺"），按比例估算或跳过扣减
 */

// =========== 模糊量词 → 默认数值映射 ===========
// 这些量词在中式菜谱中极其常见，无法精确化，给出合理估算
const VAGUE_AMOUNTS: Record<string, { value: number; unit: string }> = {
  "少许": { value: 2, unit: "g" },
  "适量": { value: 5, unit: "g" },
  "若干": { value: 5, unit: "g" },
  "一些": { value: 10, unit: "g" },
  "半勺": { value: 5, unit: "ml" },
  "数片": { value: 3, unit: "片" },
  "少量": { value: 3, unit: "g" },
};

// =========== 单位别名 → 标准单位 ===========
const UNIT_ALIASES: Record<string, string> = {
  "克": "g",
  "G": "g",
  "千克": "kg",
  "公斤": "kg",
  "斤": "jin",
  "两": "liang",
  "毫升": "ml",
  "ML": "ml",
  "升": "L",
  "勺": "spoon",
  "汤勺": "spoon",
  "大勺": "spoon",
  "茶勺": "tsp",
  "小勺": "tsp",
  "个": "个",
  "只": "个",
  "枚": "个",
  "颗": "个",
  "粒": "个",
  "根": "根",
  "条": "条",
  "片": "片",
  "块": "块",
  "把": "把",
  "瓶": "瓶",
  "盒": "盒",
  "袋": "袋",
  "包": "包",
  "杯": "杯",
  "碗": "碗",
};

// =========== 同量纲单位之间的换算系数（转换到基础单位 g 或 ml）===========
const TO_BASE_UNIT: Record<string, { factor: number; base: string }> = {
  "g":     { factor: 1, base: "g" },
  "kg":    { factor: 1000, base: "g" },
  "jin":   { factor: 500, base: "g" },
  "liang": { factor: 50, base: "g" },
  "ml":    { factor: 1, base: "ml" },
  "L":     { factor: 1000, base: "ml" },
  "spoon": { factor: 15, base: "ml" },   // 1勺 ≈ 15ml
  "tsp":   { factor: 5, base: "ml" },    // 1茶勺 ≈ 5ml
  "杯":    { factor: 250, base: "ml" },  // 1杯 ≈ 250ml
  "碗":    { factor: 300, base: "ml" },  // 1碗 ≈ 300ml
};

// =========== 调味料的密度映射 (g/ml)，用于质量↔体积换算 ===========
// 当库存单位是质量（g）但菜谱用体积（勺），需要通过密度转换
const CONDIMENT_DENSITY: Record<string, number> = {
  "酱油": 1.1,    // 酱油密度 ≈ 1.1 g/ml
  "生抽": 1.1,
  "老抽": 1.15,
  "醋": 1.05,
  "料酒": 0.95,
  "蚝油": 1.2,
  "香油": 0.92,
  "橄榄油": 0.91,
  "食用油": 0.92,
  "植物油": 0.92,
  "花生油": 0.91,
  "蒸鱼豉油": 1.1,
  "豆瓣酱": 1.15,
  "辣椒酱": 1.1,
  "番茄酱": 1.1,
  "芝麻酱": 1.1,
  "沙拉酱": 0.95,
  "蜂蜜": 1.4,
  "白糖": 0.85,   // 颗粒状，堆积密度
  "盐": 1.2,
  "味精": 0.7,
  "鸡精": 0.7,
  "淀粉": 0.5,
  "面粉": 0.5,
  "奶油": 0.95,
  "牛奶": 1.03,
  "水": 1.0,
};

export interface ParsedAmount {
  value: number;
  unit: string;        // 标准化后的单位
  originalUnit: string; // 原始单位
  isVague: boolean;    // 是否为模糊量词
}

/**
 * 解析数量字符串，如 "200g"、"少许"、"1勺"、"3 个"
 */
export function parseAmount(amountStr: string): ParsedAmount {
  if (!amountStr || amountStr.trim() === "") {
    return { value: 0, unit: "unknown", originalUnit: "", isVague: true };
  }

  const trimmed = amountStr.trim();

  // 1) 先检查是否为模糊量词
  if (VAGUE_AMOUNTS[trimmed]) {
    const va = VAGUE_AMOUNTS[trimmed];
    return { value: va.value, unit: va.unit, originalUnit: trimmed, isVague: true };
  }

  // 2) 尝试解析数字 + 单位
  const match = trimmed.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    const value = parseFloat(match[1]) || 0;
    const rawUnit = match[2].trim();
    const stdUnit = UNIT_ALIASES[rawUnit] || rawUnit;
    return { value, unit: stdUnit, originalUnit: rawUnit, isVague: false };
  }

  // 3) 纯中文量词（如"一勺"、"两个"）
  const chineseNumMap: Record<string, number> = {
    "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5,
    "六": 6, "七": 7, "八": 8, "九": 9, "十": 10, "半": 0.5,
  };
  const cnMatch = trimmed.match(/^([一二两三四五六七八九十半])\s*(.+)$/);
  if (cnMatch) {
    const value = chineseNumMap[cnMatch[1]] || 1;
    const rawUnit = cnMatch[2].trim();
    const stdUnit = UNIT_ALIASES[rawUnit] || rawUnit;
    return { value, unit: stdUnit, originalUnit: rawUnit, isVague: false };
  }

  // 4) 兜底
  return { value: 1, unit: "份", originalUnit: trimmed, isVague: true };
}

/**
 * 将 ParsedAmount 转换到基础单位（g 或 ml）
 * 如果没有换算规则，返回 null
 */
function toBaseUnit(parsed: ParsedAmount): { value: number; base: string } | null {
  const conv = TO_BASE_UNIT[parsed.unit];
  if (conv) {
    return { value: parsed.value * conv.factor, base: conv.base };
  }
  return null;
}

/**
 * 计算消耗后的库存
 *
 * @param ingredientName  食材名（用于调味料密度查找）
 * @param stockAmount     库存数量字符串，如 "500g"、"2瓶"
 * @param consumeAmount   消耗数量字符串，如 "1勺"、"少许"
 * @returns { newStockStr, consumed, skipped, reason }
 */
export function calculateConsumption(
  ingredientName: string,
  stockAmount: string,
  consumeAmount: string
): {
  newStockStr: string;
  consumedDisplay: string;
  skipped: boolean;
  reason: string;
} {
  const stock = parseAmount(stockAmount);
  const consume = parseAmount(consumeAmount);

  // 如果消耗量为 0 或解析失败
  if (consume.value <= 0) {
    return {
      newStockStr: stockAmount,
      consumedDisplay: "0",
      skipped: true,
      reason: "消耗量为0",
    };
  }

  // Case 1: 同一单位，直接减
  if (stock.unit === consume.unit) {
    const newVal = Math.max(0, stock.value - consume.value);
    return {
      newStockStr: `${newVal}${stock.originalUnit || stock.unit}`,
      consumedDisplay: `${consume.value}${consume.originalUnit}`,
      skipped: false,
      reason: "同单位直接扣减",
    };
  }

  // Case 2: 可换算到同一基础单位（如 kg→g, 勺→ml）
  const stockBase = toBaseUnit(stock);
  const consumeBase = toBaseUnit(consume);

  if (stockBase && consumeBase) {
    // 同一基础单位（都是 g 或都是 ml）
    if (stockBase.base === consumeBase.base) {
      const newBaseVal = Math.max(0, stockBase.value - consumeBase.value);
      // 转换回原始单位
      const conv = TO_BASE_UNIT[stock.unit];
      const newVal = conv ? newBaseVal / conv.factor : newBaseVal;
      const rounded = Math.round(newVal * 100) / 100;
      return {
        newStockStr: `${rounded}${stock.originalUnit || stock.unit}`,
        consumedDisplay: `${consume.value}${consume.originalUnit}`,
        skipped: false,
        reason: `换算后扣减 (${consumeBase.value}${consumeBase.base})`,
      };
    }

    // 不同基础单位（一个 g，一个 ml）→ 用密度换算
    const density = CONDIMENT_DENSITY[ingredientName];
    if (density) {
      let stockInG: number;
      let consumeInG: number;

      if (stockBase.base === "g") {
        stockInG = stockBase.value;
        consumeInG = consumeBase.value * density; // ml → g
      } else {
        stockInG = stockBase.value * density; // ml → g
        consumeInG = consumeBase.value;
      }

      const newG = Math.max(0, stockInG - consumeInG);
      // 转回原始单位
      const conv = TO_BASE_UNIT[stock.unit];
      let newVal: number;
      if (stockBase.base === "g" && conv) {
        newVal = newG / conv.factor;
      } else if (conv) {
        newVal = newG / density / conv.factor;
      } else {
        newVal = newG;
      }
      const rounded = Math.round(newVal * 100) / 100;
      return {
        newStockStr: `${rounded}${stock.originalUnit || stock.unit}`,
        consumedDisplay: `${consume.value}${consume.originalUnit} (≈${Math.round(consumeInG)}g)`,
        skipped: false,
        reason: `密度换算 (${ingredientName} ≈ ${density}g/ml)`,
      };
    }
  }

  // Case 3: 模糊消耗量（少许/适量）且库存是计数单位（个/瓶等）
  // 这种情况下不做扣减，仅标记
  if (consume.isVague) {
    return {
      newStockStr: stockAmount,
      consumedDisplay: consumeAmount,
      skipped: true,
      reason: `模糊用量"${consumeAmount}"，无法与库存单位"${stock.originalUnit}"换算`,
    };
  }

  // Case 4: 无法换算
  return {
    newStockStr: stockAmount,
    consumedDisplay: `${consume.value}${consume.originalUnit}`,
    skipped: true,
    reason: `单位不兼容: 库存"${stock.originalUnit}" vs 消耗"${consume.originalUnit}"`,
  };
}
