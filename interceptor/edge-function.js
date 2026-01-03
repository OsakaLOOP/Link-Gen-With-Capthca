// import { CONFIG } from './config.js';

const CONFIG = {
    title: "LOOP CAPTCHA",
    gatewayUrl: "https://captcha.s3xyseia.xyz",
    cookieName: "_captcha_sess",
    cookieDomain: ".s3xyseia.xyz",
    renewThreshold: 43200 // 12 hours (half of 24h)
};

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    let flow = "Unknown";
    let tokenStatus = "None";

    try {
        const request = event.request;
        const url = new URL(request.url);

        // 0. Static Asset & Content-Type Check
        const staticExtRegex = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|map|mp4|webm)$/i;

        if (staticExtRegex.test(url.pathname)) {
            flow = "Static";
            const response = await fetch(request);
            return addDebugHeaders(response, flow, tokenStatus);
        }

        // 1. Check Cookie
        const cookieHeader = request.headers.get("Cookie") || "";
        const cookies = parseCookies(cookieHeader);
        const jwt = cookies[CONFIG.cookieName];

        const SECRET = globalThis.JWT_SECRET || "CHANGE_ME_IN_PROD_SECRET_KEY_12345";

        if (jwt) {
            try {
                const payload = await verifyJWT(jwt, SECRET);
                if (payload) {
                    tokenStatus = "Valid";
                    const now = Date.now() / 1000;
                    const timeRemaining = payload.exp - now;

                    const renewPromise = fetch(CONFIG.gatewayUrl + "/api/renew", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: jwt })
                    });

                    if (timeRemaining < CONFIG.renewThreshold) {
                        flow = "Pass-Renew";
                        try {
                            const res = await renewPromise;
                            if (res.ok) {
                                const data = await res.json();
                                if (data.success && data.token) {
                                    tokenStatus = "Valid-Renewed";
                                    const response = await fetch(request);
                                    const newResponse = new Response(response.body, response);

                                    const newCookie = `${CONFIG.cookieName}=${data.token}; Domain=${CONFIG.cookieDomain}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400`;
                                    newResponse.headers.append('Set-Cookie', newCookie);

                                    return addDebugHeaders(newResponse, flow, tokenStatus);
                                }
                            }
                        } catch (err) {
                            console.error("Renew failed", err);
                            // Proceed without renewal
                        }
                    } else {
                        flow = "Pass-Auth";
                        event.waitUntil(renewPromise.catch(err => console.error("Log failed", err)));
                    }

                    const response = await fetch(request);
                    return addDebugHeaders(response, flow, tokenStatus);
                } else {
                    tokenStatus = "Invalid";
                }
            } catch (e) {
                tokenStatus = "Error";
                // console.error("JWT Verify Error", e);
            }
        }

        // 2. Redirect to Gateway Auth
        flow = "Redirect-Auth";
        const authUrl = new URL(CONFIG.gatewayUrl + "/auth");
        authUrl.searchParams.set("next", url.toString());
        authUrl.searchParams.set("hostname", url.hostname);

        const response = Response.redirect(authUrl.toString(), 302);
        return addDebugHeaders(response, flow, tokenStatus);

    } catch (e) {
        return new Response(JSON.stringify({
            error: "Internal Error",
            message: e.message || String(e),
            stack: e.stack,
            debug_flow: flow,
            debug_token: tokenStatus
        }), {
            status: 500,
            headers: {
                "content-type": "application/json; charset=utf-8",
                "access-control-allow-origin": "*"
            }
        });
    }
}

function addDebugHeaders(response, flow, tokenStatus) {
    // Clone response to modify headers (Response objects are often immutable)
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("X-Cpt-Flow", flow);
    newResponse.headers.set("X-Cpt-Token-Status", tokenStatus);
    newResponse.headers.set("X-Cpt-Origin-Status", response.status.toString());
    return newResponse;
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
