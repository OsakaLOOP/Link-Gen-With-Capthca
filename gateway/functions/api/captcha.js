export async function onRequest() {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };

  const DB = globalThis.CAPTCHA_KV;
  if (!DB) return new Response(JSON.stringify({ error: "Global CAPTCHA_KV Missing" }), { status: 500, headers });

  try {
    const listRef = await DB.list();

    if (!listRef.keys || listRef.keys.length === 0) {
      throw new Error("Captcha library is empty (no keys found)");
    }

    const randomIndex = Math.floor(Math.random() * listRef.keys.length);
    const randomKeyName = listRef.keys[randomIndex].key;

    const raw = await DB.get(randomKeyName);

    if (!raw) throw new Error(`Key '${randomKeyName}' listed but returned null`);

    try {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

      if(!data.str || !data.ans) throw new Error("Invalid data structure");

      return new Response(JSON.stringify({
        id: randomKeyName,
        str: data.str,
        hint: data.hint
      }), { headers });

    } catch (e) {
        return new Response(JSON.stringify({
        error: "Parsing Error",
        message: e.message
    }), { status: 500, headers });
    }
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Data Error",
      message: e.message
    }), { status: 500, headers });
  }
}
