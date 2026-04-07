import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 旧种子中独有的菜谱（新50道中没有的），补充 ingredients_missing 字段
const missingRecipes = [
  {id:"seed_tangcupaigu",name:"糖醋排骨",description:"酸甜可口，色泽红亮",tags:["家常菜","硬菜","下饭菜"],time:"40分钟",difficulty:"中等",calories:"450kcal",steps:["排骨焯水洗净","热油炸至金黄","锅留底油加糖炒至冒泡","加醋生抽番茄酱","放入排骨翻炒裹汁","大火收汁撒芝麻"],ingredients_missing:[{name:"排骨",amount:"500g"},{name:"白砂糖",amount:"30g"},{name:"陈醋",amount:"2勺"},{name:"生抽",amount:"1勺"},{name:"番茄酱",amount:"1勺"}]},
  {id:"seed_chaoniuhe",name:"干炒牛河",description:"粤式经典炒粉，镬气十足",tags:["家常菜","快手菜","主食"],time:"15分钟",difficulty:"中等",calories:"380kcal",steps:["河粉抖散备用","牛肉切片加生抽淀粉腌制","大火热锅滑炒牛肉盛出","放入河粉加老抽翻炒","加入豆芽韭菜大火翻炒","倒回牛肉拌匀出锅"],ingredients_missing:[{name:"河粉",amount:"300g"},{name:"牛肉",amount:"150g"},{name:"豆芽",amount:"100g"},{name:"韭菜",amount:"50g"},{name:"老抽",amount:"1勺"}]},
  {id:"seed_caesar_salad",name:"凯撒沙拉",description:"经典西式沙拉，清爽健康",tags:["轻食","沙拉","低卡","西餐"],time:"10分钟",difficulty:"简单",calories:"180kcal",steps:["生菜洗净撕小片","面包切丁烤至酥脆","鸡胸肉煎熟切片","混合生菜面包丁鸡肉","淋凯撒酱拌匀","撒帕玛森芝士碎"],ingredients_missing:[{name:"生菜",amount:"1颗"},{name:"面包",amount:"2片"},{name:"鸡胸肉",amount:"100g"},{name:"凯撒酱",amount:"2勺"},{name:"芝士碎",amount:"少许"}]},
  {id:"seed_rishi_karou",name:"日式照烧鸡腿",description:"甜咸适口，酱香浓郁",tags:["日料","快手菜","下饭菜"],time:"20分钟",difficulty:"简单",calories:"340kcal",steps:["鸡腿去骨切花刀","热锅煎鸡皮面至金黄","翻面煎3分钟","倒入照烧汁小火收汁","撒白芝麻出锅"],ingredients_missing:[{name:"鸡腿",amount:"2个"},{name:"酱油",amount:"2勺"},{name:"味醂",amount:"1勺"},{name:"白砂糖",amount:"1勺"},{name:"白芝麻",amount:"少许"}]},
  {id:"seed_shuangpi_nai",name:"双皮奶",description:"嫩滑香甜的广式经典甜品",tags:["甜品","小食","糖水"],time:"30分钟",difficulty:"简单",calories:"200kcal",steps:["全脂牛奶加热至起泡","倒入碗中放凉结皮","蛋清加糖搅拌均匀","掀起奶皮倒出牛奶与蛋清混合","过滤倒回碗中","上蒸锅蒸15分钟"],ingredients_missing:[{name:"全脂牛奶",amount:"250ml"},{name:"蛋清",amount:"2个"},{name:"白砂糖",amount:"15g"}]},
  {id:"seed_mango_banji",name:"芒果班戟",description:"港式甜品店人气王",tags:["甜品","小食","下午茶"],time:"25分钟",difficulty:"简单",calories:"250kcal",steps:["面粉+牛奶+蛋+糖搅拌成面糊","平底锅摊薄饼放凉","淡奶油打发","饼皮铺上奶油和芒果块","包成方形","冷藏后食用"],ingredients_missing:[{name:"芒果",amount:"2个"},{name:"低筋面粉",amount:"50g"},{name:"淡奶油",amount:"100ml"},{name:"鸡蛋",amount:"1个"},{name:"牛奶",amount:"100ml"}]},
  {id:"seed_xigua_binsha",name:"西瓜冰沙",description:"夏日清凉必备",tags:["饮品","果汁","清爽"],time:"5分钟",difficulty:"简单",calories:"120kcal",steps:["西瓜切块去籽","放入冰块","倒入搅拌机打碎","加少许蜂蜜调味"],ingredients_missing:[{name:"西瓜",amount:"300g"},{name:"冰块",amount:"适量"},{name:"蜂蜜",amount:"少许"}]},
  {id:"seed_lemon_tea",name:"百香果柠檬蜜",description:"酸甜清爽的果茶",tags:["饮品","茶饮","果汁"],time:"5分钟",difficulty:"简单",calories:"80kcal",steps:["柠檬切片","百香果对半切取果肉","杯中放入柠檬和百香果","加蜂蜜和凉白开加冰"],ingredients_missing:[{name:"百香果",amount:"2个"},{name:"柠檬",amount:"2片"},{name:"蜂蜜",amount:"1勺"}]},
  {id:"seed_margarita",name:"玛格丽特 Margarita",description:"经典龙舌兰鸡尾酒，酸甜平衡",tags:["鸡尾酒","调酒","酒饮","微醺","饮品"],time:"5分钟",difficulty:"简单",calories:"170kcal",steps:["杯口蘸盐做盐边","摇壶加冰块","倒入龙舌兰45ml+橙皮酒15ml+青柠汁30ml","摇匀过滤倒入杯中"],ingredients_missing:[{name:"龙舌兰酒",amount:"45ml"},{name:"橙皮酒",amount:"15ml"},{name:"青柠汁",amount:"30ml"},{name:"盐",amount:"少许"}]},
  {id:"seed_gin_tonic",name:"金汤力 Gin & Tonic",description:"最简单的经典长饮鸡尾酒",tags:["鸡尾酒","调酒","酒饮","微醺","饮品"],time:"3分钟",difficulty:"简单",calories:"130kcal",steps:["高球杯装满冰块","倒入金酒45ml","沿杯壁缓倒汤力水至满","放入青柠角"],ingredients_missing:[{name:"金酒",amount:"45ml"},{name:"汤力水",amount:"150ml"},{name:"青柠",amount:"1角"},{name:"冰块",amount:"适量"}]},
  {id:"seed_whisky_sour",name:"威士忌酸 Whisky Sour",description:"经典威士忌鸡尾酒，酸甜醇厚",tags:["鸡尾酒","调酒","酒饮","微醺","饮品"],time:"5分钟",difficulty:"简单",calories:"160kcal",steps:["摇壶加冰","倒入波本威士忌45ml","加新鲜柠檬汁30ml和糖浆15ml","大力摇匀过滤倒入杯中"],ingredients_missing:[{name:"波本威士忌",amount:"45ml"},{name:"柠檬汁",amount:"30ml"},{name:"糖浆",amount:"15ml"},{name:"冰块",amount:"适量"}]},
  {id:"seed_sangria",name:"桑格利亚水果酒",description:"西班牙风情果酒，适合聚会",tags:["鸡尾酒","调酒","酒饮","微醺","饮品"],time:"10分钟",difficulty:"简单",calories:"180kcal",steps:["橙子苹果柠檬切片","放入大壶中","倒入红葡萄酒一瓶","加橙汁和白兰地","冷藏2小时饮用更佳"],ingredients_missing:[{name:"红葡萄酒",amount:"1瓶"},{name:"橙子",amount:"1个"},{name:"苹果",amount:"1个"},{name:"白兰地",amount:"50ml"},{name:"橙汁",amount:"200ml"}]},
  {id:"seed_yumi_paigu_tang",name:"玉米排骨汤",description:"清甜滋补，老少皆宜",tags:["汤羹","家常菜","清淡"],time:"60分钟",difficulty:"简单",calories:"220kcal",steps:["排骨焯水去血沫","玉米切段胡萝卜切块","砂锅加水烧开放入排骨","小火炖40分钟加玉米再炖20分钟"],ingredients_missing:[{name:"排骨",amount:"300g"},{name:"玉米",amount:"1根"},{name:"胡萝卜",amount:"1根"},{name:"盐",amount:"少许"}]},
  {id:"seed_jianbing",name:"杂粮煎饼果子",description:"天津早点之王",tags:["早餐","快手菜","主食"],time:"10分钟",difficulty:"简单",calories:"350kcal",steps:["杂粮面糊摊成薄饼","打上鸡蛋摊匀","撒葱花香菜","翻面放薄脆刷酱卷起"],ingredients_missing:[{name:"杂粮面",amount:"50g"},{name:"鸡蛋",amount:"1个"},{name:"薄脆",amount:"1片"},{name:"甜面酱",amount:"1勺"},{name:"葱花",amount:"少许"}]},
  {id:"seed_sanmingzhi",name:"鸡蛋三明治",description:"快速营养早餐",tags:["早餐","快手菜","轻食"],time:"8分钟",difficulty:"简单",calories:"280kcal",steps:["鸡蛋煮熟切碎","加蛋黄酱盐拌匀","吐司烤至微焦","铺上蛋液和生菜","盖上吐司切开"],ingredients_missing:[{name:"鸡蛋",amount:"2个"},{name:"吐司",amount:"2片"},{name:"蛋黄酱",amount:"1勺"},{name:"生菜",amount:"1片"},{name:"盐",amount:"少许"}]},
  {id:"seed_suanlafen",name:"酸辣粉",description:"重庆小吃，酸辣开胃",tags:["宵夜","小吃","麻辣"],time:"15分钟",difficulty:"简单",calories:"320kcal",steps:["红薯粉泡软后煮熟","调汁：醋+辣椒油+花椒粉+酱油","碗中放调料倒入粉条","加花生碎和香菜"],ingredients_missing:[{name:"红薯粉",amount:"100g"},{name:"辣椒油",amount:"1勺"},{name:"陈醋",amount:"2勺"},{name:"花生碎",amount:"少许"},{name:"香菜",amount:"适量"}]},
  {id:"seed_zhajangmian",name:"老北京炸酱面",description:"浓郁酱香，配菜丰富",tags:["面条","主食","家常菜"],time:"25分钟",difficulty:"简单",calories:"400kcal",steps:["肉丁切好备用","黄酱和甜面酱混合","热油炒肉丁加酱料小火熬","面条煮熟过凉水","码上黄瓜丝豆芽浇酱"],ingredients_missing:[{name:"猪肉丁",amount:"150g"},{name:"黄酱",amount:"2勺"},{name:"甜面酱",amount:"1勺"},{name:"面条",amount:"200g"},{name:"黄瓜",amount:"1根"}]},
  {id:"seed_xiaren_zhengdan",name:"虾仁蒸蛋",description:"嫩滑营养，宝宝最爱",tags:["儿童餐","辅食","蒸菜","清淡"],time:"15分钟",difficulty:"简单",calories:"120kcal",steps:["鸡蛋打散加1.5倍温水","加盐搅匀过滤覆保鲜膜","蒸8分钟放入虾仁再蒸3分钟","淋酱油和香油"],ingredients_missing:[{name:"鸡蛋",amount:"2个"},{name:"虾仁",amount:"50g"},{name:"酱油",amount:"少许"},{name:"香油",amount:"几滴"}]},
  {id:"seed_malatang",name:"麻辣烫",description:"一个人的小火锅",tags:["麻辣","小吃","宵夜","川菜"],time:"20分钟",difficulty:"简单",calories:"350kcal",steps:["火锅底料加水烧开","先煮土豆藕片等硬菜","再下午餐肉丸子","最后放青菜粉丝","捞出蘸芝麻酱"],ingredients_missing:[{name:"火锅底料",amount:"1块"},{name:"土豆",amount:"1个"},{name:"午餐肉",amount:"100g"},{name:"青菜",amount:"适量"},{name:"粉丝",amount:"50g"}]},
];

async function run() {
  const { data, error } = await supabase
    .from("recipes")
    .insert(missingRecipes)
    .select("id, name");

  if (error) {
    console.error("插入失败:", error.message);
  } else {
    console.log(`✅ 补回 ${data.length} 道菜谱：`);
    data.forEach((r: any) => console.log(`  - ${r.name}`));
  }

  const { count } = await supabase.from("recipes").select("*", { count: "exact", head: true });
  console.log(`\n数据库总计: ${count} 道菜谱`);
}

run();
