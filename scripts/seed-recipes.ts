import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  // 1. 清除所有旧种子菜谱
  const { error: delError } = await supabase
    .from("recipes")
    .delete()
    .like("id", "seed_%");

  if (delError) {
    console.error("删除旧种子失败:", delError.message);
    return;
  }
  console.log("✅ 已清除旧种子菜谱");

  // 2. 插入用户的新菜谱
  const recipes = [
    {id:"seed_xihongshichaojidan",name:"西红柿炒鸡蛋",description:"酸甜鲜香，家常经典快手菜",tags:["家常菜","快手菜","下饭菜"],time:"10分钟",difficulty:"简单",calories:"180kcal",steps:["鸡蛋打散炒熟盛出","西红柿切块炒出汤汁","倒入鸡蛋加盐翻炒均匀"],ingredients_missing:[{name:"西红柿",amount:"2个"},{name:"鸡蛋",amount:"3个"},{name:"盐",amount:"少许"},{name:"食用油",amount:"适量"}]},
    {id:"seed_mapodoufu",name:"麻婆豆腐",description:"麻辣鲜香，滑嫩入味超下饭",tags:["川菜","家常菜","下饭菜","快手菜","麻辣"],time:"15分钟",difficulty:"简单",calories:"220kcal",steps:["豆腐切块焯水","热油炒香豆瓣酱","加清水煮沸放入豆腐","勾芡撒花椒粉葱花"],ingredients_missing:[{name:"嫩豆腐",amount:"1盒"},{name:"豆瓣酱",amount:"1勺"},{name:"花椒粉",amount:"少许"},{name:"葱花",amount:"适量"},{name:"淀粉",amount:"1勺"}]},
    {id:"seed_yuxiangrous",name:"鱼香肉丝",description:"鱼香浓郁，咸鲜酸辣超开胃",tags:["川菜","家常菜","下饭菜"],time:"20分钟",difficulty:"中等",calories:"260kcal",steps:["猪肉切丝腌制","木耳胡萝卜切丝","炒香泡椒姜蒜","放入食材加鱼香汁翻炒"],ingredients_missing:[{name:"猪里脊",amount:"200g"},{name:"木耳",amount:"50g"},{name:"胡萝卜",amount:"1根"},{name:"泡椒",amount:"3个"},{name:"鱼香调料",amount:"1包"}]},
    {id:"seed_hongshaorou",name:"红烧肉",description:"肥而不腻，酱香浓郁硬菜",tags:["家常菜","硬菜","下饭菜"],time:"60分钟",difficulty:"中等",calories:"520kcal",steps:["五花肉切块焯水","炒出糖色","放入肉块翻炒","加调料小火炖50分钟"],ingredients_missing:[{name:"五花肉",amount:"500g"},{name:"冰糖",amount:"15g"},{name:"生抽",amount:"2勺"},{name:"姜片",amount:"3片"},{name:"料酒",amount:"2勺"}]},
    {id:"seed_suanlatudousi",name:"酸辣土豆丝",description:"酸辣爽脆，解腻下饭快手菜",tags:["家常菜","快手菜","下饭菜","凉菜"],time:"8分钟",difficulty:"简单",calories:"120kcal",steps:["土豆切丝泡水去淀粉","热油爆香干辣椒","放入土豆丝大火快炒","加醋盐调味"],ingredients_missing:[{name:"土豆",amount:"2个"},{name:"干辣椒",amount:"3个"},{name:"陈醋",amount:"1勺"},{name:"盐",amount:"少许"},{name:"食用油",amount:"适量"}]},
    {id:"seed_gongbaojiding",name:"宫保鸡丁",description:"麻辣酥脆，花生鸡肉超入味",tags:["川菜","家常菜","下饭菜","快手菜"],time:"18分钟",difficulty:"中等",calories:"280kcal",steps:["鸡胸肉切丁腌制","炸花生备用","炒香干辣椒花椒","放入鸡丁加调料翻炒"],ingredients_missing:[{name:"鸡胸肉",amount:"250g"},{name:"花生",amount:"50g"},{name:"干辣椒",amount:"5个"},{name:"生抽",amount:"1勺"},{name:"淀粉",amount:"1勺"}]},
    {id:"seed_huiguorou",name:"回锅肉",description:"咸香微辣，经典川味家常菜",tags:["川菜","家常菜","下饭菜"],time:"25分钟",difficulty:"中等",calories:"380kcal",steps:["五花肉煮熟切片","热油煸炒出油","加豆瓣酱青椒翻炒","调味出锅"],ingredients_missing:[{name:"五花肉",amount:"300g"},{name:"青椒",amount:"2个"},{name:"豆瓣酱",amount:"1勺"},{name:"蒜苗",amount:"3根"},{name:"生抽",amount:"1勺"}]},
    {id:"seed_duojiaoyutou",name:"剁椒鱼头",description:"鲜辣过瘾，湘式招牌硬菜",tags:["湘菜","硬菜","下饭菜","麻辣"],time:"40分钟",difficulty:"中等",calories:"320kcal",steps:["鱼头处理干净铺剁椒","蒸锅上汽蒸30分钟","撒葱花淋热油"],ingredients_missing:[{name:"胖头鱼头",amount:"1个"},{name:"剁椒",amount:"100g"},{name:"姜片",amount:"适量"},{name:"葱花",amount:"适量"},{name:"料酒",amount:"2勺"}]},
    {id:"seed_nongjiaxiaochao",name:"农家小炒肉",description:"香辣够味，湘味快手下饭菜",tags:["湘菜","家常菜","下饭菜","快手菜"],time:"12分钟",difficulty:"简单",calories:"290kcal",steps:["五花肉切片煸炒","加青椒小米辣翻炒","加盐生抽调味"],ingredients_missing:[{name:"五花肉",amount:"200g"},{name:"青椒",amount:"3个"},{name:"小米辣",amount:"2个"},{name:"生抽",amount:"1勺"},{name:"盐",amount:"少许"}]},
    {id:"seed_lajiachaorou",name:"辣椒炒肉",description:"鲜香下饭，国民家常小炒",tags:["家常菜","快手菜","下饭菜"],time:"10分钟",difficulty:"简单",calories:"270kcal",steps:["猪肉切丝","辣椒切块","热油翻炒食材","加盐调味出锅"],ingredients_missing:[{name:"前腿肉",amount:"150g"},{name:"线椒",amount:"4个"},{name:"盐",amount:"少许"},{name:"食用油",amount:"适量"}]},
    {id:"seed_qingzhengluyu",name:"清蒸鲈鱼",description:"鲜嫩无腥，清淡蒸菜高蛋白",tags:["家常菜","硬菜","蒸菜","清淡","高蛋白"],time:"20分钟",difficulty:"简单",calories:"160kcal",steps:["鲈鱼改刀腌制","铺姜片蒸15分钟","淋蒸鱼豉油撒葱花"],ingredients_missing:[{name:"鲈鱼",amount:"1条"},{name:"蒸鱼豉油",amount:"2勺"},{name:"姜片",amount:"5片"},{name:"葱花",amount:"适量"},{name:"料酒",amount:"1勺"}]},
    {id:"seed_baizhuoxia",name:"白灼虾",description:"鲜甜弹牙，低脂快手高蛋白",tags:["家常菜","快手菜","清淡","高蛋白","低卡"],time:"8分钟",difficulty:"简单",calories:"90kcal",steps:["清水加姜片料酒煮沸","放入虾煮3分钟","蘸生抽食用"],ingredients_missing:[{name:"基围虾",amount:"300g"},{name:"姜片",amount:"3片"},{name:"生抽",amount:"2勺"},{name:"料酒",amount:"1勺"}]},
    {id:"seed_suanrongxilanhua",name:"蒜蓉西兰花",description:"清淡爽口，低卡减脂轻食",tags:["家常菜","快手菜","轻食","低卡","减脂","清淡"],time:"10分钟",difficulty:"简单",calories:"70kcal",steps:["西兰花焯水","热油炒香蒜蓉","放入西兰花翻炒加盐"],ingredients_missing:[{name:"西兰花",amount:"300g"},{name:"大蒜",amount:"5瓣"},{name:"盐",amount:"少许"},{name:"食用油",amount:"适量"}]},
    {id:"seed_xiangjianjixiong",name:"香煎鸡胸肉",description:"鲜嫩不柴，高蛋白减脂餐",tags:["轻食","高蛋白","减脂","快手菜","低卡"],time:"15分钟",difficulty:"简单",calories:"150kcal",steps:["鸡胸肉腌制10分钟","平底锅少油煎至两面金黄"],ingredients_missing:[{name:"鸡胸肉",amount:"200g"},{name:"黑胡椒",amount:"少许"},{name:"盐",amount:"少许"},{name:"橄榄油",amount:"少许"}]},
    {id:"seed_shucaisala",name:"蔬菜沙拉",description:"清爽解腻，低卡减脂轻食",tags:["西餐","轻食","低卡","减脂","沙拉","下午茶"],time:"5分钟",difficulty:"简单",calories:"60kcal",steps:["各类蔬菜洗净切块","混合淋沙拉汁拌匀"],ingredients_missing:[{name:"生菜",amount:"1颗"},{name:"黄瓜",amount:"1根"},{name:"圣女果",amount:"6颗"},{name:"沙拉汁",amount:"2勺"}]},
    {id:"seed_heijiaoniupai",name:"黑椒牛排",description:"肉质紧实，西式经典硬菜",tags:["西餐","硬菜","高蛋白"],time:"20分钟",difficulty:"中等",calories:"320kcal",steps:["牛排解冻腌制","平底锅煎至心仪熟度","淋黑椒酱"],ingredients_missing:[{name:"西冷牛排",amount:"200g"},{name:"黑胡椒酱",amount:"1勺"},{name:"海盐",amount:"少许"},{name:"黄油",amount:"10g"}]},
    {id:"seed_jingdianyimian",name:"经典意面",description:"奶香浓郁，西式主食快手菜",tags:["西餐","意面","主食","快手菜"],time:"20分钟",difficulty:"简单",calories:"350kcal",steps:["意面煮10分钟捞出","炒香培根蒜末","加奶油意面酱拌匀"],ingredients_missing:[{name:"意面",amount:"100g"},{name:"培根",amount:"50g"},{name:"奶油意面酱",amount:"1勺"},{name:"大蒜",amount:"2瓣"}]},
    {id:"seed_shousijuan",name:"寿司卷",description:"软糯鲜香，日式清淡小食",tags:["日料","主食","小食","寿司","清淡"],time:"25分钟",difficulty:"中等",calories:"220kcal",steps:["米饭铺海苔","放黄瓜火腿肉松","卷紧切段"],ingredients_missing:[{name:"海苔片",amount:"3片"},{name:"寿司米饭",amount:"200g"},{name:"黄瓜",amount:"1根"},{name:"火腿",amount:"1根"},{name:"肉松",amount:"30g"}]},
    {id:"seed_hanshibanfan",name:"韩式拌饭",description:"荤素搭配，韩式下饭主食",tags:["韩餐","主食","下饭菜","快手菜"],time:"20分钟",difficulty:"简单",calories:"420kcal",steps:["米饭铺碗底","码放焯熟蔬菜煎蛋","淋韩式辣酱拌匀"],ingredients_missing:[{name:"大米",amount:"1杯"},{name:"韩式辣酱",amount:"1勺"},{name:"鸡蛋",amount:"1个"},{name:"豆芽",amount:"50g"},{name:"胡萝卜",amount:"50g"}]},
    {id:"seed_lachaoniangao",name:"辣炒年糕",description:"软糯香辣，韩式宵夜小吃",tags:["韩餐","小吃","宵夜","麻辣","快手菜"],time:"12分钟",difficulty:"简单",calories:"280kcal",steps:["年糕焯水","炒香韩式辣酱","加年糕煮至浓稠"],ingredients_missing:[{name:"年糕条",amount:"200g"},{name:"韩式辣酱",amount:"1勺"},{name:"鱼饼",amount:"50g"},{name:"白糖",amount:"少许"}]},
    {id:"seed_chaofan",name:"扬州炒饭",description:"粒粒分明，经典主食炒饭",tags:["主食","炒饭","快手菜","家常菜"],time:"15分钟",difficulty:"简单",calories:"380kcal",steps:["米饭打散","炒香火腿丁蔬菜","倒入米饭加盐翻炒"],ingredients_missing:[{name:"剩米饭",amount:"1碗"},{name:"火腿",amount:"50g"},{name:"玉米粒",amount:"30g"},{name:"鸡蛋",amount:"1个"},{name:"盐",amount:"少许"}]},
    {id:"seed_youpomian",name:"油泼面",description:"香辣劲道，西北快手面条",tags:["主食","面条","快手菜","麻辣"],time:"10分钟",difficulty:"简单",calories:"360kcal",steps:["面条煮熟捞出","铺辣椒面蒜末葱花","淋热油加醋盐"],ingredients_missing:[{name:"鲜面条",amount:"150g"},{name:"辣椒面",amount:"1勺"},{name:"大蒜",amount:"3瓣"},{name:"陈醋",amount:"1勺"},{name:"食用油",amount:"适量"}]},
    {id:"seed_xiaolongtang",name:"紫菜蛋花汤",description:"清淡鲜美，快手汤羹早餐",tags:["汤羹","早餐","快手菜","清淡"],time:"5分钟",difficulty:"简单",calories:"50kcal",steps:["清水煮沸","淋蛋液加紫菜","加盐葱花调味"],ingredients_missing:[{name:"紫菜",amount:"5g"},{name:"鸡蛋",amount:"1个"},{name:"盐",amount:"少许"},{name:"葱花",amount:"适量"}]},
    {id:"seed_banliangan",name:"凉拌黄瓜",description:"清爽解腻，快手凉菜宵夜",tags:["凉菜","快手菜","宵夜","清淡"],time:"5分钟",difficulty:"简单",calories:"40kcal",steps:["黄瓜拍碎","加蒜末盐醋生抽拌匀"],ingredients_missing:[{name:"黄瓜",amount:"2根"},{name:"大蒜",amount:"3瓣"},{name:"生抽",amount:"1勺"},{name:"陈醋",amount:"1勺"},{name:"盐",amount:"少许"}]},
    {id:"seed_naicha",name:"珍珠奶茶",description:"丝滑香甜，经典奶茶饮品",tags:["饮品","奶茶","下午茶","宵夜"],time:"15分钟",difficulty:"简单",calories:"320kcal",steps:["煮黑珍珠","泡红茶加牛奶","混合珍珠调味"],ingredients_missing:[{name:"红茶包",amount:"2个"},{name:"纯牛奶",amount:"250ml"},{name:"黑珍珠",amount:"50g"},{name:"白糖",amount:"适量"}]},
    {id:"seed_guozhi",name:"鲜榨橙汁",description:"酸甜维C，健康果汁饮品",tags:["饮品","果汁","低卡","下午茶"],time:"5分钟",difficulty:"简单",calories:"80kcal",steps:["橙子去皮切块","榨汁机榨汁过滤"],ingredients_missing:[{name:"橙子",amount:"3个"},{name:"纯净水",amount:"少许"}]},
    {id:"seed_moguo",name:"芒果慕斯蛋糕",description:"绵密香甜，下午茶甜品",tags:["甜品","蛋糕","下午茶"],time:"40分钟",difficulty:"中等",calories:"280kcal",steps:["饼干压碎铺底","芒果泥加奶油拌匀","冷藏定型"],ingredients_missing:[{name:"消化饼干",amount:"100g"},{name:"芒果",amount:"2个"},{name:"淡奶油",amount:"150ml"},{name:"吉利丁片",amount:"2片"}]},
    {id:"seed_taohongshui",name:"银耳莲子糖水",description:"清甜润喉，中式甜品糖水",tags:["甜品","糖水","下午茶","清淡"],time:"60分钟",difficulty:"简单",calories:"150kcal",steps:["银耳泡发撕小朵","加莲子冰糖炖50分钟"],ingredients_missing:[{name:"银耳",amount:"1朵"},{name:"莲子",amount:"30g"},{name:"冰糖",amount:"适量"},{name:"红枣",amount:"5颗"}]},
    {id:"seed_mojito",name:"莫吉托鸡尾酒",description:"清新微醺，夏日调酒酒饮",tags:["鸡尾酒","调酒","酒饮","微醺"],time:"5分钟",difficulty:"简单",calories:"120kcal",steps:["薄荷叶捣碎","加青柠汁朗姆酒","兑苏打水加冰"],ingredients_missing:[{name:"朗姆酒",amount:"30ml"},{name:"青柠",amount:"1个"},{name:"薄荷叶",amount:"5片"},{name:"苏打水",amount:"100ml"},{name:"冰块",amount:"适量"}]},
    {id:"seed_zaocanzhou",name:"小米南瓜粥",description:"软糯养胃，清淡早餐辅食",tags:["早餐","辅食","清淡","儿童餐","快手菜"],time:"25分钟",difficulty:"简单",calories:"110kcal",steps:["小米淘洗","南瓜切块","加水煮至浓稠"],ingredients_missing:[{name:"小米",amount:"50g"},{name:"南瓜",amount:"100g"},{name:"清水",amount:"适量"}]},
    {id:"seed_ertongjidanquan",name:"儿童鸡蛋卷",description:"松软可口，儿童餐辅食",tags:["儿童餐","辅食","早餐","快手菜"],time:"10分钟",difficulty:"简单",calories:"130kcal",steps:["鸡蛋加面粉搅匀","平底锅摊薄饼卷起切段"],ingredients_missing:[{name:"鸡蛋",amount:"2个"},{name:"低筋面粉",amount:"20g"},{name:"牛奶",amount:"30ml"},{name:"盐",amount:"少许"}]},
    {id:"seed_qingzhengjidan",name:"蒸水蛋",description:"滑嫩鲜香，清淡蒸菜辅食",tags:["蒸菜","清淡","辅食","儿童餐","快手菜"],time:"12分钟",difficulty:"简单",calories:"90kcal",steps:["鸡蛋加温水搅匀","过筛蒸10分钟","淋生抽"],ingredients_missing:[{name:"鸡蛋",amount:"2个"},{name:"温水",amount:"150ml"},{name:"生抽",amount:"少许"},{name:"香油",amount:"几滴"}]},
    {id:"seed_luzhoupaigu",name:"卤排骨",description:"酱香入味，家常硬菜下饭菜",tags:["家常菜","硬菜","下饭菜"],time:"50分钟",difficulty:"中等",calories:"360kcal",steps:["排骨焯水","放入卤料包炖40分钟","浸泡入味"],ingredients_missing:[{name:"排骨",amount:"500g"},{name:"卤料包",amount:"1包"},{name:"生抽",amount:"2勺"},{name:"冰糖",amount:"10g"}]},
    {id:"seed_shuizhuroupian",name:"水煮肉片",description:"麻辣滚烫，川味硬菜下饭菜",tags:["川菜","硬菜","下饭菜","麻辣"],time:"30分钟",difficulty:"中等",calories:"340kcal",steps:["肉片腌制","蔬菜焯水铺底","煮肉片淋热油花椒"],ingredients_missing:[{name:"猪里脊",amount:"250g"},{name:"豆芽",amount:"100g"},{name:"干辣椒",amount:"10个"},{name:"花椒",amount:"1勺"},{name:"郫县豆瓣",amount:"1勺"}]},
    {id:"seed_xiangguchaoyoucai",name:"香菇炒油菜",description:"清淡鲜香，家常低脂快手菜",tags:["家常菜","快手菜","清淡","低卡"],time:"8分钟",difficulty:"简单",calories:"80kcal",steps:["香菇切片","油菜洗净","热油翻炒加盐调味"],ingredients_missing:[{name:"油菜",amount:"300g"},{name:"干香菇",amount:"5朵"},{name:"盐",amount:"少许"},{name:"大蒜",amount:"2瓣"}]},
    {id:"seed_jirouxiangsala",name:"鸡胸肉沙拉",description:"饱腹低脂，高蛋白减脂餐",tags:["轻食","沙拉","高蛋白","减脂","低卡"],time:"10分钟",difficulty:"简单",calories:"120kcal",steps:["鸡胸肉撕丝","蔬菜铺底","淋油醋汁拌匀"],ingredients_missing:[{name:"鸡胸肉",amount:"100g"},{name:"生菜",amount:"1颗"},{name:"紫甘蓝",amount:"30g"},{name:"油醋汁",amount:"1勺"}]},
    {id:"seed_niupaiyimian",name:"牛排意面",description:"西式双拼，主食硬菜正餐",tags:["西餐","意面","主食","硬菜"],time:"25分钟",difficulty:"中等",calories:"450kcal",steps:["煎牛排备用","煮意面拌酱","摆盘搭配"],ingredients_missing:[{name:"牛排",amount:"150g"},{name:"意面",amount:"80g"},{name:"意面酱",amount:"1勺"},{name:"西兰花",amount:"30g"}]},
    {id:"seed_shengwen",name:"三文鱼刺身",description:"鲜嫩肥美，日式高蛋白日料",tags:["日料","清淡","高蛋白","低卡"],time:"5分钟",difficulty:"简单",calories:"180kcal",steps:["三文鱼切片","搭配芥末酱油食用"],ingredients_missing:[{name:"三文鱼",amount:"100g"},{name:"芥末",amount:"少许"},{name:"刺身酱油",amount:"2勺"}]},
    {id:"seed_bingfen",name:"红糖冰粉",description:"冰爽清甜，夏日甜品小吃",tags:["甜品","小吃","下午茶","宵夜"],time:"10分钟",difficulty:"简单",calories:"130kcal",steps:["冰粉粉冲调凝固","加红糖坚果配料"],ingredients_missing:[{name:"冰粉粉",amount:"10g"},{name:"红糖浆",amount:"2勺"},{name:"花生碎",amount:"少许"},{name:"葡萄干",amount:"少许"}]},
    {id:"seed_guanyintang",name:"番茄排骨汤",description:"酸甜浓郁，家常汤羹硬菜",tags:["汤羹","家常菜","硬菜","清淡"],time:"50分钟",difficulty:"中等",calories:"220kcal",steps:["排骨焯水","番茄炒出沙","加水炖40分钟"],ingredients_missing:[{name:"排骨",amount:"400g"},{name:"西红柿",amount:"3个"},{name:"姜片",amount:"3片"},{name:"盐",amount:"少许"}]},
    {id:"seed_banfendou",name:"凉拌粉丝",description:"酸辣开胃，快手凉菜宵夜",tags:["凉菜","快手菜","宵夜","下饭菜"],time:"8分钟",difficulty:"简单",calories:"160kcal",steps:["粉丝焯水","加调料蔬菜拌匀"],ingredients_missing:[{name:"粉丝",amount:"100g"},{name:"黄瓜丝",amount:"50g"},{name:"辣椒油",amount:"1勺"},{name:"醋",amount:"1勺"}]},
    {id:"seed_zongzi",name:"鲜肉粽子",description:"咸香软糯，传统主食小吃",tags:["主食","小吃","家常菜"],time:"40分钟",difficulty:"中等",calories:"380kcal",steps:["糯米浸泡","包入鲜肉粽叶","水煮30分钟"],ingredients_missing:[{name:"糯米",amount:"200g"},{name:"五花肉",amount:"100g"},{name:"粽叶",amount:"适量"},{name:"生抽",amount:"1勺"}]},
    {id:"seed_hongdouzhou",name:"红豆薏米粥",description:"祛湿养胃，清淡早餐糖水",tags:["早餐","糖水","清淡","快手菜"],time:"30分钟",difficulty:"简单",calories:"140kcal",steps:["红豆薏米浸泡","加水煮至软烂"],ingredients_missing:[{name:"红豆",amount:"50g"},{name:"薏米",amount:"30g"},{name:"冰糖",amount:"适量"}]},
    {id:"seed_kaochanhua",name:"烤肠花菜",description:"焦香入味，宵夜小食快手菜",tags:["小食","宵夜","快手菜","家常菜"],time:"15分钟",difficulty:"简单",calories:"210kcal",steps:["花菜掰小朵","加烤肠调料烤制","翻炒出锅"],ingredients_missing:[{name:"花菜",amount:"300g"},{name:"脆皮烤肠",amount:"2根"},{name:"烧烤料",amount:"1勺"},{name:"食用油",amount:"适量"}]},
    {id:"seed_qingzhenggouqi",name:"清蒸枸杞鸡肉",description:"滋补清淡，蒸菜高蛋白家常菜",tags:["蒸菜","家常菜","清淡","高蛋白"],time:"25分钟",difficulty:"简单",calories:"170kcal",steps:["鸡肉切块腌制","铺枸杞红枣蒸20分钟"],ingredients_missing:[{name:"鸡腿肉",amount:"200g"},{name:"枸杞",amount:"10g"},{name:"红枣",amount:"3颗"},{name:"姜片",amount:"2片"}]},
    {id:"seed_niunanchaoqingjiao",name:"牛腩炒青椒",description:"鲜香劲道，硬菜下饭菜",tags:["家常菜","硬菜","下饭菜"],time:"35分钟",difficulty:"中等",calories:"330kcal",steps:["牛腩炖软","青椒切块翻炒","调味出锅"],ingredients_missing:[{name:"牛腩",amount:"300g"},{name:"青椒",amount:"3个"},{name:"生抽",amount:"1勺"},{name:"盐",amount:"少许"}]},
    {id:"seed_guozhichaoyin",name:"水果茶",description:"果香清新，茶饮下午茶饮品",tags:["饮品","茶饮","果汁","下午茶"],time:"10分钟",difficulty:"简单",calories:"90kcal",steps:["泡绿茶放凉","加水果块蜂蜜调味"],ingredients_missing:[{name:"绿茶",amount:"5g"},{name:"西瓜",amount:"50g"},{name:"柠檬",amount:"2片"},{name:"蜂蜜",amount:"1勺"}]},
    {id:"seed_xiaojidanbing",name:"鸡蛋小饼",description:"松软便携，儿童早餐小食",tags:["早餐","儿童餐","小食","快手菜"],time:"10分钟",difficulty:"简单",calories:"160kcal",steps:["鸡蛋面粉搅匀","平底锅煎成小饼"],ingredients_missing:[{name:"鸡蛋",amount:"1个"},{name:"面粉",amount:"30g"},{name:"葱花",amount:"少许"},{name:"盐",amount:"少许"}]},
    {id:"seed_weixunweijiu",name:"微醺果味鸡尾酒",description:"果香微醺，低度调酒酒饮",tags:["鸡尾酒","调酒","酒饮","微醺"],time:"3分钟",difficulty:"简单",calories:"100kcal",steps:["果酒加气泡水","加水果冰块摇匀"],ingredients_missing:[{name:"蜜桃果酒",amount:"50ml"},{name:"气泡水",amount:"100ml"},{name:"草莓",amount:"2颗"},{name:"冰块",amount:"适量"}]},
    {id:"seed_qingcaimian",name:"清汤青菜面",description:"清淡暖胃，早餐面条快手菜",tags:["主食","面条","早餐","清淡","快手菜"],time:"8分钟",difficulty:"简单",calories:"240kcal",steps:["面条煮熟","加青菜盐香油调味"],ingredients_missing:[{name:"挂面",amount:"100g"},{name:"小青菜",amount:"50g"},{name:"盐",amount:"少许"},{name:"香油",amount:"几滴"}]},
  ];

  const { data, error } = await supabase
    .from("recipes")
    .insert(recipes)
    .select("id, name");

  if (error) {
    console.error("插入失败:", error.message);
  } else {
    console.log(`✅ 成功插入 ${data.length} 道种子菜谱`);
    data.forEach((r: any) => console.log(`  - ${r.name}`));
  }

  // 统计
  const { count } = await supabase.from("recipes").select("*", { count: "exact", head: true });
  console.log(`\n数据库总计: ${count} 道菜谱`);
}

run();
