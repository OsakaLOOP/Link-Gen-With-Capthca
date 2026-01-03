export async function onRequest() {
  const headers = { "Content-Type": "application/json" };
  const DB = globalThis.LINK_KV; // 使用短链数据库测试

  if (!DB) return new Response(JSON.stringify({ error: "No DB" }), { status: 500 });

  const testKey = "ttl_test_" + Date.now();
  const testVal = "should_expire_in_60s";
  
  let putResult = "unknown";
  let errorMsg = null;

  try {
    // 【关键测试】尝试传入第三个参数
    // 设置 60秒 后过期
    await DB.put(testKey, testVal, { expirationTtl: 60 });
    putResult = "Success (No Error Thrown)";
  } catch (e) {
    putResult = "Failed";
    errorMsg = e.message;
  }

  // 立即读取一次验证写入是否成功
  const readBack = await DB.get(testKey);

  return new Response(JSON.stringify({
    test_key: testKey,
    put_status: putResult,
    error: errorMsg,
    immediate_read: readBack,
    note: "If put_status is Success, check back in 60 seconds. If key is gone, TTL works."
  }, null, 2), { headers });
}