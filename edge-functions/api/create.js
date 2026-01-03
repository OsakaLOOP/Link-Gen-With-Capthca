const CONFIG = {
  ACCESS_TOKEN: "lolimainichi", 
  CODE_LENGTH: 6
};

export async function onRequest({ request }) {
  const headers = { 
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };

  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers });

  const LinkDB = globalThis.LINK_KV;
  const CapDB = globalThis.CAPTCHA_KV;

  if (!LinkDB || !CapDB) return new Response(JSON.stringify({ error: "KV Bindings Missing" }), { status: 500, headers });

  try {
    const token = request.headers.get("X-Access-Token");
    if (token !== CONFIG.ACCESS_TOKEN) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });

    const body = await request.json();
    const { url: targetUrl, slug, ttl, capId, capAns } = body;

    const rawCap = await CapDB.get(String(capId)); 
    
    if (!rawCap) throw new Error("Captcha Expired or Invalid ID");
    
    const capData = typeof rawCap === 'string' ? JSON.parse(rawCap) : rawCap;
    const userAns = (capAns || "").trim().toLowerCase();
    const possibleAnswers = Array.isArray(capData.ans) ? capData.ans : [capData.ans];
    
    if (!possibleAnswers.some(a => a.trim().toLowerCase() === userAns)) throw new Error("Incorrect Captcha");

    if (!targetUrl || !targetUrl.startsWith('http')) throw new Error("Invalid URL");

    let finalSlug = slug ? slug.trim() : "";
    if (finalSlug) {
      if (await LinkDB.get(finalSlug)) throw new Error("Slug Taken");
    } else {
      let i = 0;
      do {
        finalSlug = Math.random().toString(36).substring(2, 2 + CONFIG.CODE_LENGTH);
        if (!(await LinkDB.get(finalSlug))) break;
      } while (++i < 5);
      if (i >= 5) throw new Error("Server Busy");
    }

    const ttlSeconds = parseInt(ttl) || 86400;
    const expireAt = Date.now() + (ttlSeconds * 1000);

    const payload = {
      url: targetUrl,
      expireAt: expireAt,
      createdAt: Date.now()
    };

    await LinkDB.put(finalSlug, JSON.stringify(payload));

    return new Response(JSON.stringify({ 
      success: true, 
      slug: finalSlug,
      expireAt: new Date(expireAt).toISOString()
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400, headers });
  }
}