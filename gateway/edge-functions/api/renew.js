const CONFIG = {
  SESSION_TTL: 86400,
};

export async function onRequest({ request }) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [origin]; // In a strict setup, validate against a whitelist. Here we mirror to allow all subdomains.

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers });

  const SessDB = globalThis.SESSION_KV;
  const SECRET = globalThis.JWT_SECRET || "CHANGE_ME_IN_PROD_SECRET_KEY_12345";

  if (!SessDB) return new Response(JSON.stringify({ error: "KV Bindings Missing" }), { status: 500, headers });

  try {
    const body = await request.json();
    const token = body.token;

    if (!token) throw new Error("Missing token");

    // Verify JWT
    const payload = await verifyJWT(token, SECRET);
    if (!payload || !payload.sid) throw new Error("Invalid Token");

    const now = Math.floor(Date.now() / 1000);

    // Update KV (Log access)
    // We update the expiration TTL to keep the session alive in KV as well
    await SessDB.put(payload.sid, JSON.stringify({
      last_seen: now,
      user_agent: request.headers.get("User-Agent") || "unknown"
    }), { expirationTtl: CONFIG.SESSION_TTL });

    // Generate New JWT
    const exp = now + CONFIG.SESSION_TTL;
    const newJwt = await signJWT({ ...payload, exp }, SECRET);

    // Set-Cookie Header
    // Note: EdgeOne Pages might sit behind a proxy, but we set standard attributes.
    const cookieName = "_captcha_sess";
    const cookieValue = `${cookieName}=${newJwt}; Domain=.s3xyseia.xyz; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${CONFIG.SESSION_TTL}`;
    headers["Set-Cookie"] = cookieValue;

    return new Response(JSON.stringify({
      success: true,
      token: newJwt,
      expiresAt: new Date(exp * 1000).toISOString()
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 401, headers });
  }
}

async function verifyJWT(token, secret) {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        if (!headerB64 || !payloadB64 || !signatureB64) return null;

        const data = `${headerB64}.${payloadB64}`;

        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const signature = base64UrlDecode(signatureB64);
        const isValid = await crypto.subtle.verify(
            "HMAC",
            key,
            signature,
            new TextEncoder().encode(data)
        );

        if (!isValid) return null;

        const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
        if (payload.exp && Date.now() / 1000 > payload.exp) return null;

        return payload;
    } catch (e) {
        return null;
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

function base64UrlDecode(input) {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = input.length % 4;
    if (pad) {
        if (pad === 1) throw new Error('InvalidLengthError');
        input += new Array(5 - pad).join('=');
    }

    const binaryString = atob(input);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
