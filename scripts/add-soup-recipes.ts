// 一次性脚本：往 supabase 新增 20 道汤品（不删任何已有数据）
// 与 seed-recipes.ts 里的同名 entry 保持一致，将来 reseed 也不丢
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const soups = [
  {id:"seed_soup_fanqie_danhua",name:"番茄蛋花汤",description:"酸甜清爽，鸡蛋番茄经典快手汤",tags:["汤羹","快手菜","清淡","家常菜"],time:"12分钟",difficulty:"简单",calories:"95kcal",steps:["番茄切块下锅煮出汤汁","加水煮沸调味","蛋液淋入划散即可"],ingredients_missing:[{name:"番茄",amount:"2个"},{name:"鸡蛋",amount:"2个"},{name:"葱花",amount:"少许"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_zicai_doufu",name:"紫菜豆腐汤",description:"鲜香清淡，海味豆腐快手汤",tags:["汤羹","快手菜","清淡","家常菜"],time:"10分钟",difficulty:"简单",calories:"110kcal",steps:["豆腐切块焯水","紫菜泡发","水开下豆腐紫菜调味即可"],ingredients_missing:[{name:"嫩豆腐",amount:"1盒"},{name:"紫菜",amount:"5g"},{name:"虾皮",amount:"10g"},{name:"香油",amount:"几滴"}]},
  {id:"seed_soup_xihongshi_niurou",name:"西红柿牛肉汤",description:"酸香浓郁，牛肉番茄硬菜汤",tags:["汤羹","浓郁","硬菜","家常菜"],time:"28分钟",difficulty:"中等",calories:"260kcal",steps:["牛肉切块焯水","番茄炒出沙","加水放牛肉炖25分钟","调味出锅"],ingredients_missing:[{name:"牛腩",amount:"300g"},{name:"番茄",amount:"3个"},{name:"姜片",amount:"3片"},{name:"盐",amount:"适量"}]},
  {id:"seed_soup_chuanwei_suanla",name:"川味酸辣汤",description:"酸辣开胃，川菜经典开胃汤",tags:["汤羹","酸辣","川菜","快手菜"],time:"20分钟",difficulty:"中等",calories:"150kcal",steps:["豆腐木耳切丝","锅中加水煮沸","下配料调酸辣味","勾芡淋蛋液"],ingredients_missing:[{name:"嫩豆腐",amount:"100g"},{name:"木耳",amount:"30g"},{name:"鸡蛋",amount:"1个"},{name:"陈醋",amount:"2勺"},{name:"白胡椒粉",amount:"少许"},{name:"淀粉",amount:"1勺"}]},
  {id:"seed_soup_yiner_lianzi",name:"银耳莲子羹",description:"清甜润燥，养颜下午茶糖水",tags:["汤羹","甜品","糖水","下午茶"],time:"15分钟",difficulty:"简单",calories:"120kcal",steps:["银耳泡发撕小朵","加莲子红枣冰糖煮15分钟","出锅前撒枸杞"],ingredients_missing:[{name:"银耳",amount:"半朵"},{name:"莲子",amount:"30g"},{name:"红枣",amount:"5颗"},{name:"冰糖",amount:"20g"},{name:"枸杞",amount:"少许"}]},
  {id:"seed_soup_luosong",name:"罗宋汤",description:"酸甜浓郁，俄式经典西餐汤",tags:["汤羹","西餐","浓郁"],time:"30分钟",difficulty:"中等",calories:"230kcal",steps:["牛肉切丁焯水","蔬菜切丁炒香","加番茄酱炖煮25分钟","调味出锅"],ingredients_missing:[{name:"牛肉",amount:"200g"},{name:"卷心菜",amount:"100g"},{name:"胡萝卜",amount:"1根"},{name:"土豆",amount:"1个"},{name:"番茄酱",amount:"2勺"},{name:"洋葱",amount:"半个"}]},
  {id:"seed_soup_haidai_doufu",name:"海带豆腐汤",description:"海味清淡，补碘养胃家常汤",tags:["汤羹","清淡","家常菜","低卡"],time:"15分钟",difficulty:"简单",calories:"100kcal",steps:["海带洗净切丝","豆腐切块","加水煮10分钟","调味出锅"],ingredients_missing:[{name:"海带丝",amount:"100g"},{name:"嫩豆腐",amount:"1盒"},{name:"姜片",amount:"2片"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_xihu_niurou",name:"西湖牛肉羹",description:"鲜美浓稠，杭帮经典浓汤",tags:["汤羹","浓郁","家常菜"],time:"18分钟",difficulty:"中等",calories:"170kcal",steps:["牛肉剁碎焯水","加水煮沸下豆腐丁","勾芡","淋蛋液撒香菜"],ingredients_missing:[{name:"牛里脊",amount:"150g"},{name:"嫩豆腐",amount:"100g"},{name:"鸡蛋清",amount:"2个"},{name:"淀粉",amount:"2勺"},{name:"香菜",amount:"少许"}]},
  {id:"seed_soup_nangua_nong",name:"南瓜浓汤",description:"奶香醇厚，营养西式浓汤",tags:["汤羹","西餐","浓郁","奶香"],time:"20分钟",difficulty:"简单",calories:"180kcal",steps:["南瓜切块蒸熟","加牛奶搅打成泥","回锅煮沸调味"],ingredients_missing:[{name:"贝贝南瓜",amount:"500g"},{name:"牛奶",amount:"200ml"},{name:"淡奶油",amount:"50ml"},{name:"黑胡椒",amount:"少许"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_naiyou_mogu",name:"奶油蘑菇浓汤",description:"奶香浓郁，西式经典蘑菇汤",tags:["汤羹","西餐","浓郁","奶香"],time:"22分钟",difficulty:"中等",calories:"220kcal",steps:["蘑菇切片炒香","加面粉炒匀","倒入牛奶搅打成糊","调味出锅"],ingredients_missing:[{name:"白蘑菇",amount:"200g"},{name:"洋葱",amount:"半个"},{name:"牛奶",amount:"300ml"},{name:"黄油",amount:"15g"},{name:"面粉",amount:"1勺"}]},
  {id:"seed_soup_rishi_weiceng",name:"日式味噌汤",description:"清淡鲜香，和风快手早餐汤",tags:["汤羹","日料","清淡","快手菜","早餐"],time:"10分钟",difficulty:"简单",calories:"80kcal",steps:["水煮沸下海带","加味噌酱拌匀","下豆腐和裙带菜煮2分钟"],ingredients_missing:[{name:"味噌酱",amount:"2勺"},{name:"嫩豆腐",amount:"100g"},{name:"裙带菜",amount:"5g"},{name:"葱花",amount:"少许"}]},
  {id:"seed_soup_hanshi_dajiang",name:"韩式大酱汤",description:"酱香浓郁，韩式经典家常汤",tags:["汤羹","韩餐","浓郁"],time:"25分钟",difficulty:"中等",calories:"210kcal",steps:["土豆洋葱切块","加大酱炒香","加水炖15分钟","下豆腐青椒煮熟"],ingredients_missing:[{name:"韩式大酱",amount:"3勺"},{name:"嫩豆腐",amount:"半盒"},{name:"土豆",amount:"1个"},{name:"洋葱",amount:"半个"},{name:"青椒",amount:"1个"}]},
  {id:"seed_soup_muer_jidan",name:"木耳鸡蛋汤",description:"清香润肺，黑木耳快手汤",tags:["汤羹","清淡","家常菜","快手菜"],time:"12分钟",difficulty:"简单",calories:"90kcal",steps:["木耳泡发撕小朵","加水煮5分钟","淋蛋液调味"],ingredients_missing:[{name:"黑木耳",amount:"30g"},{name:"鸡蛋",amount:"2个"},{name:"姜丝",amount:"少许"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_sigua_danhua",name:"丝瓜蛋花汤",description:"清甜爽口，夏日消暑快手汤",tags:["汤羹","清淡","家常菜","快手菜"],time:"10分钟",difficulty:"简单",calories:"85kcal",steps:["丝瓜削皮切块","水开下丝瓜煮3分钟","淋蛋液调味"],ingredients_missing:[{name:"丝瓜",amount:"1根"},{name:"鸡蛋",amount:"2个"},{name:"虾皮",amount:"少许"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_donggua_xiapi",name:"冬瓜虾皮汤",description:"鲜美清淡，利水消肿家常汤",tags:["汤羹","清淡","家常菜","低卡"],time:"15分钟",difficulty:"简单",calories:"70kcal",steps:["冬瓜切片","加水煮10分钟","下虾皮调味"],ingredients_missing:[{name:"冬瓜",amount:"300g"},{name:"虾皮",amount:"15g"},{name:"姜丝",amount:"少许"},{name:"葱花",amount:"少许"}]},
  {id:"seed_soup_yumi_naiyou",name:"玉米奶油浓汤",description:"奶香甘甜，西式儿童最爱浓汤",tags:["汤羹","西餐","浓郁","奶香","甜口","儿童餐"],time:"20分钟",difficulty:"简单",calories:"190kcal",steps:["玉米粒煮熟","加牛奶搅打成糊","回锅煮沸调味"],ingredients_missing:[{name:"甜玉米粒",amount:"300g"},{name:"牛奶",amount:"250ml"},{name:"黄油",amount:"10g"},{name:"淡奶油",amount:"30ml"}]},
  {id:"seed_soup_fanqie_doufu",name:"番茄豆腐汤",description:"酸鲜暖胃，平价快手家常汤",tags:["汤羹","清淡","家常菜","快手菜"],time:"12分钟",difficulty:"简单",calories:"100kcal",steps:["番茄切块炒出汤汁","加水下豆腐煮5分钟","调味出锅"],ingredients_missing:[{name:"番茄",amount:"2个"},{name:"嫩豆腐",amount:"1盒"},{name:"葱花",amount:"少许"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_mala_feiniu",name:"麻辣肥牛汤",description:"麻辣过瘾，川式重口下饭硬菜",tags:["汤羹","川菜","麻辣","香辣","硬菜","下饭菜"],time:"25分钟",difficulty:"中等",calories:"380kcal",steps:["肥牛卷涮水","炒香花椒辣椒","加水煮沸下肥牛","加麻辣调料调味"],ingredients_missing:[{name:"肥牛卷",amount:"300g"},{name:"金针菇",amount:"100g"},{name:"麻辣火锅底料",amount:"2勺"},{name:"花椒",amount:"少许"},{name:"干辣椒",amount:"5个"}]},
  {id:"seed_soup_niurou_fensi",name:"牛肉粉丝汤",description:"鲜香管饱，主食粉丝家常汤",tags:["汤羹","主食","家常菜","咸香"],time:"22分钟",difficulty:"简单",calories:"310kcal",steps:["牛肉切片腌制","水开煮粉丝","加牛肉煮3分钟","调味撒葱花"],ingredients_missing:[{name:"牛肉片",amount:"150g"},{name:"龙口粉丝",amount:"50g"},{name:"白菜",amount:"100g"},{name:"生抽",amount:"1勺"},{name:"盐",amount:"少许"}]},
  {id:"seed_soup_jidan_gedatang",name:"鸡蛋疙瘩汤",description:"软糯暖胃，北方家常主食汤",tags:["汤羹","主食","家常菜","快手菜","早餐"],time:"15分钟",difficulty:"简单",calories:"260kcal",steps:["面粉加水搅成疙瘩","水开下番茄煮沸","下面疙瘩煮5分钟","淋蛋液调味"],ingredients_missing:[{name:"面粉",amount:"100g"},{name:"鸡蛋",amount:"2个"},{name:"番茄",amount:"1个"},{name:"小青菜",amount:"50g"},{name:"葱花",amount:"少许"}]},
];

async function run() {
  console.log(`准备插入 ${soups.length} 道汤品...`);

  // 检查 id 冲突
  const ids = soups.map((s) => s.id);
  const { data: existing } = await supabase
    .from("recipes")
    .select("id")
    .in("id", ids);
  const existingIds = new Set((existing || []).map((r: any) => r.id));
  if (existingIds.size > 0) {
    console.warn(`⚠️ 已存在 ${existingIds.size} 道，将跳过：`, [...existingIds].join(", "));
  }

  const toInsert = soups.filter((s) => !existingIds.has(s.id));
  if (toInsert.length === 0) {
    console.log("没有新菜要插入。");
    return;
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert(toInsert)
    .select("id, name");

  if (error) {
    console.error("❌ 插入失败:", error.message);
    return;
  }
  console.log(`✅ 成功插入 ${data!.length} 道汤品：`);
  data!.forEach((r: any) => console.log(`  - ${r.name} (${r.id})`));

  const { count } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true });
  console.log(`\n数据库总计: ${count} 道菜谱`);
}

run();
