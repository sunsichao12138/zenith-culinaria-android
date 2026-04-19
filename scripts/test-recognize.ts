// 拍照识别速度测试脚本
const API_KEY = process.env.ARK_API_KEY;
const MODEL_ID = process.env.ARK_VISION_MODEL_ID || process.env.ARK_MODEL_ID || "doubao-1.5-pro-256k-250115";
const ENDPOINT = process.env.ARK_API_ENDPOINT || "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

if (!API_KEY) {
  console.error("❌ ARK_API_KEY not set. Run with: npx tsx --env-file=.env.local scripts/test-recognize.ts");
  process.exit(1);
}

// 生成一个简单的 100x100 红色测试图片 (base64 JPEG)
// 用 canvas 不可行，这里用一个最小 JPEG 来测试 API 连通性和速度
async function createTestImage(): Promise<string> {
  // 使用一个公开图片 URL 来模拟真实场景
  const url = "https://images.unsplash.com/photo-1518977676601-b53f82ber40?w=400&h=300&fit=crop";
  // 备用方案：直接用一个小的 base64 编码图片
  // 这是一个 1x1 像素的红色 JPEG
  const tinyJpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA/w//Z";
  return tinyJpeg;
}

async function testWithRealImage(): Promise<string> {
  // 下载一个真实的食材图片进行测试
  console.log("📸 下载测试图片...");
  const imgResponse = await fetch("https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=300&fit=crop");
  if (!imgResponse.ok) {
    console.log("⚠️  无法下载测试图片，使用最小测试图");
    return createTestImage();
  }
  const buffer = await imgResponse.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  console.log(`✅ 图片下载完成 (${Math.round(base64.length / 1024)}KB)`);
  return `data:image/jpeg;base64,${base64}`;
}

async function runTest(testName: string, imageData: string) {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `请仔细观察这张照片，识别照片中的食材/食品。

## 要求
1. 识别照片中最主要的一种食材或食品
2. 估算其数量和合适的单位
3. 判断其分类
4. 购买日期默认为今天：${today}
5. 根据食材类型估算合理的保存天数

## 分类选项（只能从以下选择）
蔬菜、水果、蛋奶肉类、海鲜水产、主食干货、豆制品、调料、饮品、零食、其他

## 单位选项（只能从以下选择）
克、千克、个、瓶、盒、袋

## 输出格式（严格JSON，不要markdown标记，不要额外文字）
{
  "name": "食材名称",
  "category": "分类",
  "amount": "数量（纯数字）",
  "unit": "单位",
  "purchaseDate": "${today}",
  "expiryDays": "保存天数（纯数字）"
}`;

  console.log(`\n🧪 测试: ${testName}`);
  console.log(`📡 模型: ${MODEL_ID}`);
  console.log(`📏 图片大小: ${Math.round(imageData.length / 1024)}KB`);

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageData },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 256,
      }),
    });
    clearTimeout(timeout);

    const apiTime = Date.now() - startTime;

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`❌ API 错误 (${response.status}): ${errBody.slice(0, 200)}`);
      console.log(`⏱️  耗时: ${apiTime}ms`);
      return;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    const parseStart = Date.now();
    const result = JSON.parse(jsonStr);
    const parseTime = Date.now() - parseStart;
    const totalTime = Date.now() - startTime;

    console.log(`\n✅ 识别成功！`);
    console.log(`   食材: ${result.name}`);
    console.log(`   分类: ${result.category}`);
    console.log(`   数量: ${result.amount} ${result.unit}`);
    console.log(`   保存: ${result.expiryDays} 天`);
    console.log(`\n⏱️  性能数据:`);
    console.log(`   API 请求: ${apiTime}ms`);
    console.log(`   JSON 解析: ${parseTime}ms`);
    console.log(`   总耗时: ${totalTime}ms`);

    // Usage info
    if (data.usage) {
      console.log(`\n📊 Token 使用:`);
      console.log(`   Prompt tokens: ${data.usage.prompt_tokens}`);
      console.log(`   Completion tokens: ${data.usage.completion_tokens}`);
      console.log(`   Total tokens: ${data.usage.total_tokens}`);
    }

  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    if (err.name === "AbortError") {
      console.error(`❌ 超时 (30s limit)，耗时: ${elapsed}ms`);
    } else {
      console.error(`❌ 错误: ${err.message}，耗时: ${elapsed}ms`);
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  🔬 拍照识别食材 - 速度测试");
  console.log("═══════════════════════════════════════");

  const realImage = await testWithRealImage();

  // 测试 1：当前模型 (Seed-2.0-lite)
  await runTest("当前模型 (lite)", realImage);

  // 测试 2：视觉模型 (Seed-2.0-mini) + thinking disabled
  const origModel = MODEL_ID;
  (globalThis as any).__VISION_MODEL = "ep-20260407202624-dq5cf";
  await runTestWithModel("视觉模型 (mini) + thinking:disabled", realImage, "ep-20260407202624-dq5cf", true);

  console.log("\n═══════════════════════════════════════");
  console.log("  测试完成");
  console.log("═══════════════════════════════════════");
}

async function runTestWithModel(testName: string, imageData: string, modelId: string, disableThinking: boolean) {
  const today = new Date().toISOString().split("T")[0];
  const prompt = `请仔细观察这张照片，识别照片中的食材/食品。

## 要求
1. 识别照片中最主要的一种食材或食品
2. 估算其数量和合适的单位
3. 判断其分类

## 分类选项（只能从以下选择）
蔬菜、水果、蛋奶肉类、海鲜水产、主食干货、豆制品、调料、饮品、零食、其他

## 单位选项（只能从以下选择）
克、千克、个、瓶、盒、袋

## 输出格式（严格JSON，不要markdown标记）
{"name":"食材名","category":"分类","amount":"数字","unit":"单位","purchaseDate":"${today}","expiryDays":"天数"}`;

  console.log(`\n🧪 测试: ${testName}`);
  console.log(`📡 模型: ${modelId}`);
  console.log(`🧠 Thinking: ${disableThinking ? "disabled" : "enabled"}`);

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const bodyObj: any = {
      model: modelId,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageData } },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 256,
    };
    if (disableThinking) {
      bodyObj.thinking = { type: "disabled" };
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify(bodyObj),
    });
    clearTimeout(timeout);

    const apiTime = Date.now() - startTime;

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`❌ API 错误 (${response.status}): ${errBody.slice(0, 300)}`);
      console.log(`⏱️  耗时: ${apiTime}ms`);
      return;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const result = JSON.parse(jsonStr);
    const totalTime = Date.now() - startTime;

    console.log(`✅ 识别: ${result.name} (${result.category}) ${result.amount}${result.unit}`);
    console.log(`⏱️  API: ${apiTime}ms | 总耗时: ${totalTime}ms`);
    if (data.usage) {
      console.log(`📊 Tokens: prompt=${data.usage.prompt_tokens} completion=${data.usage.completion_tokens} total=${data.usage.total_tokens}`);
    }
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ ${err.name === "AbortError" ? "超时" : err.message}，耗时: ${elapsed}ms`);
  }
}

main();
