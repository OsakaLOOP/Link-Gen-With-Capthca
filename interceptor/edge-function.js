// import { CONFIG } from './config.js';

const CONFIG = {
    title: "LOOP CAPTCHA",
    gatewayUrl: "https://captcha.s3xyesia.xyz",
    cookieName: "_captcha_sess",
};

export async function onFetch(event) {
    try {
        const request = event.request;
        const url = new URL(request.url);

        // 0. Static Asset & Content-Type Check
        const staticExtRegex = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|map|mp4|webm)$/i;

        if (staticExtRegex.test(url.pathname)) {
            return fetch(request);
        }

        // 1. Check Cookie
        const cookieHeader = request.headers.get("Cookie") || "";
        const cookies = parseCookies(cookieHeader);
        const jwt = cookies[CONFIG.cookieName];

        const SECRET = globalThis.JWT_SECRET || "CHANGE_ME_IN_PROD_SECRET_KEY_12345";

        if (jwt) {
            try {
                const isValid = await verifyJWT(jwt, SECRET);
                if (isValid) {
                    return fetch(request);
                }
            } catch (e) {
                // Invalid JWT, continue to redirect
            }
        }

        // 2. Redirect to Gateway Auth
        const authUrl = new URL(CONFIG.gatewayUrl + "/auth");
        authUrl.searchParams.set("next", url.toString());
        authUrl.searchParams.set("hostname", url.hostname);

        return Response.redirect(authUrl.toString(), 302);

    } catch (e) {
        return new Response(JSON.stringify({
            error: "Internal Error",
            message: e.message || String(e)
        }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=utf-8",
                "access-control-allow-origin": "*"
            }
        });
    }
}

function parseCookies(header) {
    const list = {};
    if (!header) return list;
    header.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

async function verifyJWT(token, secret) {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        if (!headerB64 || !payloadB64 || !signatureB64) return false;

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

        if (!isValid) return false;

        const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
        if (payload.exp && Date.now() / 1000 > payload.exp) return false;

        return true;
    } catch (e) {
        return false;
    }
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
