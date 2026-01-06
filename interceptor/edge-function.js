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
    try {
        const request = event.request;
        const url = new URL(request.url);

        // Prepare headers for origin fetch (strip auth cookie)
        const originHeaders = new Headers(request.headers);
        originHeaders.delete("Host");
        originHeaders.delete("Origin");
        originHeaders.delete("Referer");
        // CRSF avoidance
        const originCookieHeader = originHeaders.get("Cookie");
        
        if (originCookieHeader) {
            const cookies = originCookieHeader.split(';');
            const filteredCookies = cookies
                .map(c => c.trim())
                .filter(c => {
                    const name = c.split('=')[0];
                    return name !== CONFIG.cookieName;
                });

            if (filteredCookies.length > 0) {
                originHeaders.set("Cookie", filteredCookies.join('; '));
            } else {
                originHeaders.delete("Cookie");
            }
        }

        const fetchOptions = {
            redirect: 'manual', // 手动处理重定向，保留 Upstream 的 Set-Cookie
            headers: originHeaders,
            eo: {
                timeoutSetting: {
                    connectTimeout: 30000, // 30s
                    readTimeout: 60000,    // 60s (流媒体/API长轮询)
                    writeTimeout: 30000    // 30s
                }
            }
        };

        // 0. Static Asset & Content-Type Check
        const staticExtRegex = /\.(css|js|mjs|map|png|jpg|jpeg|gif|svg|ico|webp|bmp|woff|woff2|ttf|eot|otf|mp4|webm|mp3|wav|ogg|flac|json|webmanifest|xml|txt|cur|wasm)$/i;

        if (staticExtRegex.test(url.pathname)) {
            return fetch(request, fetchOptions);
        }

        // 1. Check Cookie
        const cookieHeader = request.headers.get("Cookie") || "";
        const cookies = parseCookies(cookieHeader);
        const jwt = cookies[CONFIG.cookieName];
        

        // Access environment variable. In EdgeOne, variables bound to the function are typically global.
        const SECRET = env.JWT_SECRET;
        if (!SECRET) {return new Response(JSON.stringify({ error: "Server Misconfiguration" }), { status: 500, headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": "*"
        }});}

        if (jwt) {
            try {
                const payload = await verifyJWT(jwt, SECRET);
                if (payload) {
                    const now = Date.now() / 1000;
                    const timeRemaining = payload.exp - now;

                    // Fetch origin content
                    const response = await fetch(request, fetchOptions);

                    // Logic: Check if renewal injection is needed
                    // 1. Time remaining is less than threshold
                    // 2. Content-Type is HTML

                    const contentType = response.headers.get("Content-Type") || "";
                    const isHtml = contentType.includes("text/html");

                    if (timeRemaining < CONFIG.renewThreshold && isHtml) {
                        try {
                            // Decode body (handles gzip automatically if fetch supports it, or raw stream)
                            // Note: standard fetch(request) usually decompresses automatically.
                            const text = await response.text();

                            // Generate Nonce for CSP
                            const nonce = generateNonce();

                            // Inject Script
                            // Use a simple replacement before </body>
                            const injectionScript = `
                            <script nonce="${nonce}">
                            (function() {
                                var token = "${jwt}";
                                fetch("${CONFIG.gatewayUrl}/api/renew", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ token: token }),
                                    credentials: "include"
                                }).then(r => {
                                    if(r.ok) console.debug("Session renewed");
                                }).catch(e => console.error("Session renew failed", e));
                            })();
                            </script>
                            </body>
                            `;

                            const modifiedBody = text.replace('</body>', injectionScript);

                            // Create new Response
                            const newResponse = new Response(modifiedBody, response);

                            // CRITICAL: Remove Content-Encoding because we decoded the body
                            // Remove Content-Length because size changed
                            newResponse.headers.delete("Content-Encoding");
                            newResponse.headers.delete("Content-Length");

                            // CSP Modification: Inject Nonce instead of removing headers
                            const cspHeader = newResponse.headers.get("Content-Security-Policy");
                            const cspReportHeader = newResponse.headers.get("Content-Security-Policy-Report-Only");

                            if (cspHeader) {
                                newResponse.headers.set("Content-Security-Policy", injectNonceToCsp(cspHeader, nonce));
                            }
                            if (cspReportHeader) {
                                newResponse.headers.set("Content-Security-Policy-Report-Only", injectNonceToCsp(cspReportHeader, nonce));
                            }

                            return newResponse;

                        } catch (err) {
                            console.error("Injection failed, returning original response", err);
                            // If anything fails during reading/modifying, strictly we might have consumed the body?
                            // In Service Workers, if we awaited response.text(), the original response body is used.
                            // We can't easily fallback to the original stream if we already consumed it.
                            // However, we are in a try block. If response.text() failed, we have nothing.
                            // If response.text() succeeded but something else failed, we can use the text.
                            // For safety, if we can't inject, we might have to serve the text without injection.
                             return new Response("Internal Proxy Error during Renewal Injection", { status: 502 });
                        }
                    }

                    return response;
                }
            } catch (e) {
                // Invalid JWT, continue to redirect
                // console.error("JWT Verify Error", e);
            }
        }

        // 2. Redirect to Gateway Auth
        const authUrl = new URL(CONFIG.gatewayUrl + "/auth");

        // Extract EO Properties
        // @ts-ignore
        const eo = request.eo || {};
        const geo = eo.geo || {};

        const rayId = eo.uuid || request.headers.get("EO-LOG-UUID") || ((typeof crypto !== 'undefined' && crypto.randomUUID && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : generateRayId());
        const clientIP = eo.clientIp || request.headers.get("EO-Client-IP") || "1.1.1.1";

        authUrl.searchParams.set("next", url.toString());
        authUrl.searchParams.set("hostname", url.hostname);
        authUrl.searchParams.set("rayid", rayId);
        authUrl.searchParams.set("ip", clientIP);

        if (geo.countryName) authUrl.searchParams.set("country", geo.countryName);
        if (geo.regionName) authUrl.searchParams.set("region", geo.regionName);
        if (geo.cityName) authUrl.searchParams.set("city", geo.cityName);
        if (geo.latitude) authUrl.searchParams.set("lat", geo.latitude);
        if (geo.longitude) authUrl.searchParams.set("long", geo.longitude);
        if (geo.asn) authUrl.searchParams.set("asn", geo.asn);

        return Response.redirect(authUrl.toString(), 302);

    } catch (e) {
        return new Response(JSON.stringify({
            error: "Internal Error",
            message: e.message || String(e),
            stack: e.stack
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

function generateRayId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).replace(/[^a-zA-Z0-9]/g, '');
}

function injectNonceToCsp(csp, nonce) {
    // 1. Check if script-src exists
    const scriptSrcRegex = /(script-src\s+[^;]+)/i;

    if (scriptSrcRegex.test(csp)) {
        // Append nonce to script-src
        return csp.replace(scriptSrcRegex, `$1 'nonce-${nonce}'`);
    }

    // 2. If no script-src, check default-src
    const defaultSrcRegex = /(default-src\s+[^;]+)/i;
    if (defaultSrcRegex.test(csp)) {
         // Append nonce to default-src (valid fallback)
        return csp.replace(defaultSrcRegex, `$1 'nonce-${nonce}'`);
    }

    // 3. If neither, we don't inject.
    // If the CSP doesn't restrict scripts (no default-src or script-src), we don't need a nonce.
    // If it's empty, we leave it empty.
    return csp;
}
