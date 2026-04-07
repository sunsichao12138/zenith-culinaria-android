import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const seedRecipes = [
  // ═══ 家常菜 ═══
  {
    id: "seed_hongshaorou",
    name: "红烧肉",
    description: "经典家常菜，肥而不腻，入口即化",
    tags: ["家常菜", "硬菜", "下饭菜"],
    time: "60分钟",
    difficulty: "中等",
    calories: "520kcal",
    steps: ["五花肉切块焯水", "锅中炒糖色", "放入五花肉翻炒上色", "加生抽老抽料酒", "加水没过肉，大火烧开转小火炖40分钟", "大火收汁"],
  },
  {
    id: "seed_yuxiangrousi",
    name: "鱼香肉丝",
    description: "酸甜咸辣，下饭神器",
    tags: ["家常菜", "川菜", "下饭菜"],
    time: "20分钟",
    difficulty: "简单",
    calories: "320kcal",
    steps: ["猪肉切丝加淀粉腌制", "调鱼香汁：醋、糖、酱油、豆瓣酱", "热油滑炒肉丝盛出", "爆香蒜末姜末泡椒", "加入胡萝卜丝木耳丝笋丝翻炒", "倒回肉丝，浇鱼香汁翻炒均匀"],
  },
  {
    id: "seed_gongbaojiding",
    name: "宫保鸡丁",
    description: "鲜辣微甜，花生酥脆",
    tags: ["家常菜", "川菜", "下饭菜"],
    time: "20分钟",
    difficulty: "简单",
    calories: "350kcal",
    steps: ["鸡胸肉切丁，加料酒淀粉腌制", "调宫保汁：醋、糖、酱油、淀粉", "热油爆香干辣椒花椒", "滑炒鸡丁至变色", "倒入宫保汁翻炒", "撒入花生米出锅"],
  },
  {
    id: "seed_tangcupaigu",
    name: "糖醋排骨",
    description: "酸甜可口，色泽红亮",
    tags: ["家常菜", "硬菜", "下饭菜"],
    time: "40分钟",
    difficulty: "中等",
    calories: "450kcal",
    steps: ["排骨焯水洗净", "热油炸至金黄", "锅留底油，加糖炒至冒泡", "加醋、生抽、番茄酱", "放入排骨翻炒裹汁", "大火收汁撒芝麻"],
  },
  {
    id: "seed_huiguorou",
    name: "回锅肉",
    description: "川菜经典，肥肉不腻",
    tags: ["家常菜", "川菜", "下饭菜", "硬菜"],
    time: "25分钟",
    difficulty: "简单",
    calories: "400kcal",
    steps: ["五花肉整块煮至断生", "切薄片备用", "热锅煎五花肉至微卷出油", "下豆瓣酱炒出红油", "加入蒜苗青椒翻炒", "调味出锅"],
  },
  {
    id: "seed_mapo_doufu",
    name: "麻婆豆腐",
    description: "川味正宗，麻辣鲜香",
    tags: ["家常菜", "川菜", "麻辣", "下饭菜"],
    time: "15分钟",
    difficulty: "简单",
    calories: "280kcal",
    steps: ["豆腐切块焯水", "热油炒碎猪肉末", "下豆瓣酱炒出红油", "加水烧开，放入豆腐", "小火炖5分钟", "勾芡撒花椒粉香葱"],
  },
  {
    id: "seed_chaoniuhe",
    name: "干炒牛河",
    description: "粤式经典炒粉，镬气十足",
    tags: ["家常菜", "快手菜", "主食"],
    time: "15分钟",
    difficulty: "中等",
    calories: "380kcal",
    steps: ["河粉抖散备用", "牛肉切片加生抽淀粉腌制", "大火热锅滑炒牛肉盛出", "放入河粉加老抽翻炒", "加入豆芽韭菜大火翻炒", "倒回牛肉拌匀出锅"],
  },
  // ═══ 快手菜 ═══
  {
    id: "seed_suanla_tudousi",
    name: "酸辣土豆丝",
    description: "开胃爽脆，五分钟搞定",
    tags: ["家常菜", "快手菜", "凉菜", "下饭菜"],
    time: "10分钟",
    difficulty: "简单",
    calories: "150kcal",
    steps: ["土豆切细丝泡水去淀粉", "热油爆香干辣椒花椒", "大火快炒土豆丝", "加醋、盐调味", "翻炒1分钟即出锅"],
  },
  {
    id: "seed_chaojidan",
    name: "番茄炒蛋",
    description: "国民家常菜，酸甜下饭",
    tags: ["家常菜", "快手菜", "下饭菜"],
    time: "10分钟",
    difficulty: "简单",
    calories: "220kcal",
    steps: ["鸡蛋打散加盐", "番茄切块", "热油炒鸡蛋盛出", "炒番茄至出汁", "倒回鸡蛋翻炒", "加糖盐调味出锅"],
  },
  // ═══ 轻食/沙拉 ═══
  {
    id: "seed_caesar_salad",
    name: "凯撒沙拉",
    description: "经典西式沙拉，清爽健康",
    tags: ["轻食", "沙拉", "低卡", "西餐"],
    time: "10分钟",
    difficulty: "简单",
    calories: "180kcal",
    steps: ["生菜洗净撕小片", "面包切丁烤至酥脆", "鸡胸肉煎熟切片", "混合生菜、面包丁、鸡肉", "淋凯撒酱拌匀", "撒帕玛森芝士碎"],
  },
  {
    id: "seed_jixiong_shala",
    name: "牛油果鸡胸肉沙拉",
    description: "高蛋白低碳水，健身人群最爱",
    tags: ["轻食", "沙拉", "低卡", "高蛋白", "减脂"],
    time: "15分钟",
    difficulty: "简单",
    calories: "250kcal",
    steps: ["鸡胸肉水煮至熟，撕成丝", "牛油果切块", "混合生菜、小番茄、玉米粒", "摆盘放上鸡丝和牛油果", "淋油醋汁"],
  },
  // ═══ 西餐 ═══
  {
    id: "seed_yishi_mianpasta",
    name: "意式番茄肉酱面",
    description: "经典意面，浓郁酱汁",
    tags: ["西餐", "意面", "主食"],
    time: "30分钟",
    difficulty: "简单",
    calories: "420kcal",
    steps: ["意面按包装煮至al dente", "牛肉末炒散", "加入洋葱丁蒜末炒香", "倒入番茄酱和番茄丁", "小火熬15分钟", "拌入意面撒芝士粉"],
  },
  {
    id: "seed_niupai",
    name: "黑椒煎牛排",
    description: "外焦里嫩，餐厅级口感",
    tags: ["西餐", "牛排", "硬菜", "高蛋白"],
    time: "20分钟",
    difficulty: "中等",
    calories: "380kcal",
    steps: ["牛排提前半小时回温", "两面撒盐和黑胡椒", "热锅加橄榄油，大火煎1分钟", "翻面再煎1分钟", "转中火煎至理想熟度", "静置5分钟切片"],
  },
  // ═══ 日韩料理 ═══
  {
    id: "seed_rishi_karou",
    name: "日式照烧鸡腿",
    description: "甜咸适口，酱香浓郁",
    tags: ["日料", "快手菜", "下饭菜"],
    time: "20分钟",
    difficulty: "简单",
    calories: "340kcal",
    steps: ["鸡腿去骨切花刀", "热锅煎鸡皮面至金黄", "翻面煎3分钟", "倒入照烧汁（酱油+味醂+糖+水）", "小火收汁至浓稠", "撒白芝麻出锅"],
  },
  {
    id: "seed_hanguoshipin",
    name: "韩式石锅拌饭",
    description: "五彩缤纷，拌匀后香辣",
    tags: ["韩餐", "主食", "下饭菜"],
    time: "25分钟",
    difficulty: "简单",
    calories: "400kcal",
    steps: ["准备各色蔬菜丝（胡萝卜、菠菜、豆芽）", "分别炒熟调味", "石锅刷香油，铺米饭", "摆上蔬菜和煎蛋", "加韩式辣酱", "大火烤至锅巴"],
  },
  {
    id: "seed_shousi",
    name: "三文鱼手卷寿司",
    description: "清新日料，在家轻松做",
    tags: ["日料", "寿司", "轻食"],
    time: "20分钟",
    difficulty: "简单",
    calories: "280kcal",
    steps: ["寿司饭加醋拌匀放凉", "海苔剪成正方形", "铺上寿司饭", "放三文鱼片、牛油果、黄瓜", "卷成锥形", "蘸酱油芥末食用"],
  },
  // ═══ 甜品 ═══
  {
    id: "seed_shuangpi_nai",
    name: "双皮奶",
    description: "嫩滑香甜的广式经典甜品",
    tags: ["甜品", "小食", "糖水"],
    time: "30分钟",
    difficulty: "简单",
    calories: "200kcal",
    steps: ["全脂牛奶加热至起泡", "倒入碗中放凉结皮", "蛋清加糖搅拌均匀", "掀起奶皮倒出牛奶与蛋清混合", "过滤倒回碗中（奶皮浮起）", "上蒸锅蒸15分钟"],
  },
  {
    id: "seed_mango_bingsha",
    name: "芒果班戟",
    description: "港式甜品店人气王",
    tags: ["甜品", "小食", "下午茶"],
    time: "25分钟",
    difficulty: "简单",
    calories: "250kcal",
    steps: ["面粉+牛奶+蛋+糖搅拌成面糊", "平底锅摊薄饼放凉", "淡奶油打发", "饼皮铺上奶油和芒果块", "包成方形", "冷藏后食用"],
  },
  // ═══ 饮品 ═══
  {
    id: "seed_zhenzhu_naicha",
    name: "手工珍珠奶茶",
    description: "自制Q弹珍珠，健康无添加",
    tags: ["饮品", "奶茶", "下午茶"],
    time: "30分钟",
    difficulty: "简单",
    calories: "280kcal",
    steps: ["木薯粉加红糖水揉成面团", "搓成小圆球", "水开下珍珠煮15分钟焖10分钟", "红茶泡浓后放凉", "杯中放珍珠加冰", "倒入茶和牛奶"],
  },
  {
    id: "seed_xigua_binsha",
    name: "西瓜冰沙",
    description: "夏日清凉必备",
    tags: ["饮品", "果汁", "清爽"],
    time: "5分钟",
    difficulty: "简单",
    calories: "120kcal",
    steps: ["西瓜切块去籽", "放入冰块", "倒入搅拌机打碎", "加少许蜂蜜调味", "倒入杯中即可"],
  },
  {
    id: "seed_lemon_tea",
    name: "百香果柠檬蜜",
    description: "酸甜清爽的果茶",
    tags: ["饮品", "茶饮", "果汁"],
    time: "5分钟",
    difficulty: "简单",
    calories: "80kcal",
    steps: ["柠檬切片", "百香果对半切取果肉", "杯中放入柠檬和百香果", "加蜂蜜和凉白开", "加冰搅拌均匀"],
  },
  // ═══ 鸡尾酒/微醺 ═══
  {
    id: "seed_mojito",
    name: "莫吉托 Mojito",
    description: "清爽薄荷鸡尾酒，夏日微醺首选",
    tags: ["鸡尾酒", "调酒", "酒饮", "微醺", "饮品"],
    time: "5分钟",
    difficulty: "简单",
    calories: "150kcal",
    steps: ["薄荷叶和青柠角放入杯中", "加白砂糖轻捣", "倒入白朗姆酒45ml", "加满碎冰", "倒入苏打水", "插薄荷枝装饰"],
  },
  {
    id: "seed_margarita",
    name: "玛格丽特 Margarita",
    description: "经典龙舌兰鸡尾酒，酸甜平衡",
    tags: ["鸡尾酒", "调酒", "酒饮", "微醺", "饮品"],
    time: "5分钟",
    difficulty: "简单",
    calories: "170kcal",
    steps: ["杯口蘸盐做盐边", "摇壶加冰块", "倒入龙舌兰45ml+橙皮酒15ml+青柠汁30ml", "摇匀15秒", "过滤倒入杯中", "青柠片装饰"],
  },
  {
    id: "seed_gin_tonic",
    name: "金汤力 Gin & Tonic",
    description: "最简单的经典长饮鸡尾酒",
    tags: ["鸡尾酒", "调酒", "酒饮", "微醺", "饮品"],
    time: "3分钟",
    difficulty: "简单",
    calories: "130kcal",
    steps: ["高球杯装满冰块", "倒入金酒45ml", "沿杯壁缓倒汤力水至满", "轻搅两圈", "放入青柠角或黄瓜片"],
  },
  {
    id: "seed_whisky_sour",
    name: "威士忌酸 Whisky Sour",
    description: "经典威士忌鸡尾酒，酸甜醇厚",
    tags: ["鸡尾酒", "调酒", "酒饮", "微醺", "饮品"],
    time: "5分钟",
    difficulty: "简单",
    calories: "160kcal",
    steps: ["摇壶加冰", "倒入波本威士忌45ml", "加新鲜柠檬汁30ml", "加糖浆15ml", "大力摇匀15秒", "过滤倒入古典杯，柠檬皮装饰"],
  },
  {
    id: "seed_sangria",
    name: "桑格利亚水果酒",
    description: "西班牙风情果酒，适合聚会",
    tags: ["鸡尾酒", "调酒", "酒饮", "微醺", "饮品"],
    time: "10分钟",
    difficulty: "简单",
    calories: "180kcal",
    steps: ["橙子苹果柠檬切片", "放入大壶中", "倒入红葡萄酒一瓶", "加橙汁200ml和白兰地50ml", "加蜂蜜或糖适量", "冷藏2小时以上饮用更佳"],
  },
  // ═══ 汤羹 ═══
  {
    id: "seed_xihushi_dantang",
    name: "番茄蛋花汤",
    description: "清淡暖胃的经典汤品",
    tags: ["汤羹", "家常菜", "快手菜", "清淡"],
    time: "10分钟",
    difficulty: "简单",
    calories: "100kcal",
    steps: ["番茄切块", "热油炒出汁", "加水烧开", "淋入打散的蛋液", "加盐调味", "撒香葱出锅"],
  },
  {
    id: "seed_yumi_paigu_tang",
    name: "玉米排骨汤",
    description: "清甜滋补，老少皆宜",
    tags: ["汤羹", "家常菜", "清淡"],
    time: "60分钟",
    difficulty: "简单",
    calories: "220kcal",
    steps: ["排骨焯水去血沫", "玉米切段胡萝卜切块", "砂锅加水烧开放入排骨", "小火炖40分钟", "加入玉米胡萝卜再炖20分钟", "加盐调味"],
  },
  // ═══ 早餐 ═══
  {
    id: "seed_jianbing",
    name: "杂粮煎饼果子",
    description: "天津早点之王",
    tags: ["早餐", "快手菜", "主食"],
    time: "10分钟",
    difficulty: "简单",
    calories: "350kcal",
    steps: ["杂粮面糊摊成薄饼", "打上鸡蛋摊匀", "撒葱花香菜", "翻面放薄脆", "刷甜面酱辣酱", "卷起切半"],
  },
  {
    id: "seed_xishipaobing",
    name: "鸡蛋三明治",
    description: "快速营养早餐",
    tags: ["早餐", "快手菜", "轻食"],
    time: "8分钟",
    difficulty: "简单",
    calories: "280kcal",
    steps: ["鸡蛋煮熟切碎", "加蛋黄酱盐胡椒拌匀", "吐司烤至微焦", "铺上蛋液和生菜", "盖上另一片吐司", "对角切开"],
  },
  // ═══ 宵夜/小吃 ═══
  {
    id: "seed_chaofan",
    name: "蛋炒饭",
    description: "深夜食堂经典，简单美味",
    tags: ["宵夜", "快手菜", "主食", "炒饭"],
    time: "10分钟",
    difficulty: "简单",
    calories: "380kcal",
    steps: ["隔夜饭打散", "鸡蛋打散备用", "热油倒入蛋液炒散", "加入米饭大火翻炒", "加盐酱油调味", "撒葱花出锅"],
  },
  {
    id: "seed_suanla_fen",
    name: "酸辣粉",
    description: "重庆小吃，酸辣开胃",
    tags: ["宵夜", "小吃", "麻辣"],
    time: "15分钟",
    difficulty: "简单",
    calories: "320kcal",
    steps: ["红薯粉泡软后煮熟", "调汁：醋+辣椒油+花椒粉+酱油+蒜泥", "碗中放调料", "倒入粉条和汤", "加花生碎和香菜", "撒葱花出锅"],
  },
  // ═══ 蒸菜/清淡 ═══
  {
    id: "seed_qingzheng_luyu",
    name: "清蒸鲈鱼",
    description: "鲜美嫩滑，原汁原味",
    tags: ["蒸菜", "清淡", "家常菜"],
    time: "20分钟",
    difficulty: "简单",
    calories: "180kcal",
    steps: ["鲈鱼处理干净，划几刀", "鱼身铺姜片葱段", "上蒸锅大火蒸8分钟", "倒掉蒸鱼水", "淋蒸鱼豉油", "热油浇在鱼身和葱丝上"],
  },
  // ═══ 高蛋白 ═══
  {
    id: "seed_jixiong_rou",
    name: "香煎鸡胸肉",
    description: "高蛋白低脂，健身必备",
    tags: ["高蛋白", "鸡胸肉", "减脂", "轻食"],
    time: "15分钟",
    difficulty: "简单",
    calories: "200kcal",
    steps: ["鸡胸肉用刀背拍松", "加盐黑椒橄榄油腌15分钟", "平底锅中火热油", "鸡胸肉煎3分钟", "翻面再煎3分钟", "切片装盘"],
  },
  // ═══ 面条 ═══
  {
    id: "seed_zhajangmian",
    name: "老北京炸酱面",
    description: "浓郁酱香，配菜丰富",
    tags: ["面条", "主食", "家常菜"],
    time: "25分钟",
    difficulty: "简单",
    calories: "400kcal",
    steps: ["肉丁切好备用", "黄酱和甜面酱按2:1混合", "热油炒肉丁至出油", "加入酱料小火熬10分钟", "面条煮熟过凉水", "码上黄瓜丝豆芽等菜码浇酱"],
  },
  // ═══ 儿童餐 ═══
  {
    id: "seed_xiaren_zhengdan",
    name: "虾仁蒸蛋",
    description: "嫩滑营养，宝宝最爱",
    tags: ["儿童餐", "辅食", "蒸菜", "清淡"],
    time: "15分钟",
    difficulty: "简单",
    calories: "120kcal",
    steps: ["鸡蛋打散加1.5倍温水", "加少许盐搅匀过滤", "覆保鲜膜扎小孔", "上蒸锅小火蒸8分钟", "放入虾仁再蒸3分钟", "淋酱油和香油"],
  },
  // ═══ 火锅 ═══
  {
    id: "seed_malatang",
    name: "麻辣烫",
    description: "一个人的小火锅",
    tags: ["麻辣", "小吃", "宵夜", "川菜"],
    time: "20分钟",
    difficulty: "简单",
    calories: "350kcal",
    steps: ["火锅底料加水烧开", "先煮土豆藕片等硬菜", "再下午餐肉丸子", "最后放青菜和粉丝", "煮1-2分钟", "捞出蘸芝麻酱"],
  },
];

async function run() {
  console.log(`准备插入 ${seedRecipes.length} 道种子菜谱...`);

  // 先删除旧种子（保留 ai_ 开头的）
  const { error: delError } = await supabase
    .from("recipes")
    .delete()
    .not("id", "like", "ai_%");

  if (delError) {
    console.error("删除旧种子失败:", delError.message);
  } else {
    console.log("已清理旧种子菜谱");
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert(seedRecipes)
    .select("id, name");

  if (error) {
    console.error("插入失败:", error.message);
  } else {
    console.log(`✅ 成功插入 ${data.length} 道种子菜谱：`);
    data.forEach((r: any) => console.log(`  - ${r.name}`));
  }
}

run();
