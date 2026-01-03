const CONFIG = {
  SESSION_TTL: 86400,
  COOKIE_NAME: '_captcha_sess',
  COOKIE_DOMAIN: '.s3xyseia.xyz'
};

export async function onRequest({ request }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers });

  const CapDB = globalThis.CAPTCHA_KV;
  const SessDB = globalThis.SESSION_KV;

  if (!CapDB || !SessDB) return new Response(JSON.stringify({ error: "KV Bindings Missing" }), { status: 500, headers });

  try {
    const body = await request.json();
    const { capId, capAns } = body;

    if (!capId || !capAns) throw new Error("Missing parameters");

    const rawCap = await CapDB.get(String(capId));
    if (!rawCap) throw new Error("Captcha Expired or Invalid ID");

    const capData = typeof rawCap === 'string' ? JSON.parse(rawCap) : rawCap;
    const userAns = (capAns || "").trim().toLowerCase();
    const possibleAnswers = Array.isArray(capData.ans) ? capData.ans : [capData.ans];

    if (!possibleAnswers.some(a => a.trim().toLowerCase() === userAns)) {
        return new Response(JSON.stringify({ success: false, error: "Incorrect Answer" }), { status: 400, headers });
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + (CONFIG.SESSION_TTL * 1000);

    await SessDB.put(sessionId, JSON.stringify({
      valid: true,
      created: Date.now(),
      expiresAt: expiresAt
    }), { expirationTtl: CONFIG.SESSION_TTL });

    const cookieHeader = `${CONFIG.COOKIE_NAME}=${sessionId}; Domain=${CONFIG.COOKIE_DOMAIN}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${CONFIG.SESSION_TTL}`;

    headers['Set-Cookie'] = cookieHeader;

    return new Response(JSON.stringify({
      success: true,
      expiresAt: new Date(expiresAt).toISOString()
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
