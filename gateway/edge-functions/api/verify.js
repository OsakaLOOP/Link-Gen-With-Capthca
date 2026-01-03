const CONFIG = {
  SESSION_TTL: 86400,
  COOKIE_NAME: '_captcha_sess',
  COOKIE_DOMAIN: '.s3xyesia.xyz'
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

  // Secret should be provided via environment variable
  const SECRET = globalThis.JWT_SECRET || "CHANGE_ME_IN_PROD_SECRET_KEY_12345";

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

    // Generate Session ID & JWT
    const now = Math.floor(Date.now() / 1000);
    const exp = now + CONFIG.SESSION_TTL;
    const sid = crypto.randomUUID();

    // Store in KV for logging/tracking
    await SessDB.put(sid, JSON.stringify({
      created: now,
      last_seen: now,
      user_agent: request.headers.get("User-Agent") || "unknown"
    }), { expirationTtl: CONFIG.SESSION_TTL });

    const jwt = await signJWT({ valid: true, sid, exp }, SECRET);

    const cookieHeader = `${CONFIG.COOKIE_NAME}=${jwt}; Domain=${CONFIG.COOKIE_DOMAIN}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${CONFIG.SESSION_TTL}`;

    headers['Set-Cookie'] = cookieHeader;

    return new Response(JSON.stringify({
      success: true,
      expiresAt: new Date(exp * 1000).toISOString()
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}

async function signJWT(payload, secret) {
    const header = { alg: "HS256", typ: "JWT" };
    const encHeader = base64UrlEncode(JSON.stringify(header));
    const encPayload = base64UrlEncode(JSON.stringify(payload));
    const data = `${encHeader}.${encPayload}`;

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
    const encSignature = base64UrlEncode(signature);

    return `${data}.${encSignature}`;
}

function base64UrlEncode(input) {
    let source;
    if (typeof input === "string") {
        source = new TextEncoder().encode(input);
    } else {
        source = new Uint8Array(input);
    }

    return btoa(String.fromCharCode(...source))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
