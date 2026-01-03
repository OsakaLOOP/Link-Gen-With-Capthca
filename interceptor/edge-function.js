import { CONFIG } from './config.js';

export async function onFetch(event) {
  const request = event.request;
  const url = new URL(request.url);

  // 0. Static Asset & Content-Type Check
  // User Requirement: filter staticExt with regex; only protect when html loaded.
  const staticExtRegex = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|map|mp4|webm)$/i;

  // If it's a static file, bypass protection
  if (staticExtRegex.test(url.pathname) ) {
      return fetch(request);
  }

  // 1. Check Cookie
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[CONFIG.cookieName];

  if (sessionId) {
    const SessDB = globalThis.SESSION_KV;
    if (SessDB) {
      try {
        const sessionRaw = await SessDB.get(sessionId);
        if (sessionRaw) {
           return fetch(request);
        }
      } catch (e) {
        // KV Error, ignore and show captcha
      }
    }
  }

  // 2. Render Captcha Page
  const html = getCaptchaPage(url.hostname);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
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

function getCaptchaPage(hostname) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <style>
        body{font-family:system-ui,-apple-system,sans-serif}
        .spoiler{background-color:#1f2937;color:#1f2937;border-radius:4px;padding:0 4px;cursor:help;transition:all 0.2s ease;user-select:none}
        .spoiler:hover{background-color:transparent;color:#9ca3af}
        .hljs { background: transparent !important; padding: 0 !important; }
        .katex { font-size: 1.1em; }
    </style>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 text-center border-b border-gray-100">
             <div class="flex justify-center mb-4">${CONFIG.icon}</div>
             <h1 class="text-xl font-bold text-gray-800 mb-2">${CONFIG.title}</h1>
             <p class="text-sm text-gray-500">
                Please complete the security check to access <br>
                <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">${hostname}</span>
             </p>
        </div>

        <div class="p-6 bg-gray-50">
            <!-- Captcha Container -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div class="bg-gray-50 border border-gray-200 rounded shadow-sm p-3 mb-3 flex justify-between items-center select-none">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 bg-white border-2 border-gray-300 rounded-sm flex items-center justify-center shadow-inner">
                            <svg class="w-4 h-4 text-green-500 animate-[bounce_0.5s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-600 font-sans">I'm not a robot</span>
                    </div>
                    <div class="flex flex-col items-center opacity-70">
                         <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                         </svg>
                        <span class="text-[6px] text-gray-500 mt-0.5">reCAPTCHA</span>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-2 select-none">
                    <div class="text-sm font-mono text-blue-900 font-bold break-all pr-2" id="qStr">Loading...</div>
                    <button onclick="loadCap()" class="text-blue-400 hover:text-blue-600 flex-shrink-0">↻</button>
                </div>

                <div class="flex items-center gap-2">
                    <span class="text-sm text-blue-800">Answer:</span>
                    <input type="text" id="cAns" placeholder="..." class="flex-1 border rounded px-2 py-1 text-sm outline-none focus:border-blue-500">
                </div>

                <div class="mt-2 text-xs text-right">
                    <span class="text-gray-400 mr-1">Hint:</span><span id="cHint" class="spoiler">...</span>
                </div>
                <input type="hidden" id="cId">
                <div id="err" class="text-red-500 text-xs text-center mt-2 hidden"></div>
            </div>

            <button onclick="verify()" id="btn" class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
                Verify
            </button>
        </div>
        <div class="p-3 text-center bg-gray-100 border-t border-gray-200">
             <p class="text-[10px] text-gray-400">Protected by EdgeOne Functions</p>
        </div>
    </div>

    <script>
        const API_HOST = "${CONFIG.gatewayUrl}";

        document.addEventListener('DOMContentLoaded', loadCap);

        async function loadCap() {
            const qStr = document.getElementById('qStr');
            const hint = document.getElementById('cHint');
            const qContainer = qStr.parentElement;
            const err = document.getElementById('err');

            err.classList.add('hidden');
            qContainer.classList.add('animate-pulse');
            qStr.classList.add('opacity-50');

            try {
                const res = await fetch(\`\${API_HOST}/api/captcha\`);
                const d = await res.json();

                let raw = d.str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");

                const codeBlocks = [];
                raw = raw.replace(/\\\`\\\`\\\`(\\\w*)\\n([\\s\\S]*?)\\\`\\\`\\\`/g, (match, lang, code) => {
                    const cleanCode = code.replace(/^\\n+|\\n+$/g, '');
                    const langClass = lang ? \`language-\${lang}\` : '';
                    codeBlocks.push({ code: cleanCode, lang: langClass });
                    return \`__CODE_BLOCK_\${codeBlocks.length - 1}__\`;
                });

                const latexBlocks = [];
                raw = raw.replace(/\\$\\$([\\s\\S]*?)\\$\\$/g, (match, tex) => {
                    const cleanTex = tex.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
                    latexBlocks.push({ tex: cleanTex, displayMode: true });
                    return \`__LATEX_\${latexBlocks.length - 1}__\`;
                });
                raw = raw.replace(/\\$([^$]+)\\$/g, (match, tex) => {
                    const cleanTex = tex.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
                    latexBlocks.push({ tex: cleanTex, displayMode: false });
                    return \`__LATEX_\${latexBlocks.length - 1}__\`;
                });

                raw = raw.replace(/\\n/g, '<br>');
                raw = raw.replace(/\\\`([^\\\`]+)\\\`/g,
                    '<code class="bg-indigo-50 text-indigo-600 px-1.5 rounded border border-indigo-100 font-mono text-sm mx-1">$1</code>'
                );

                raw = raw.replace(/__LATEX_(\\d+)__/g, (match, index) => {
                    const item = latexBlocks[index];
                    try {
                        return katex.renderToString(item.tex, { displayMode: item.displayMode, throwOnError: false });
                    } catch (err) { return \`<span class="text-red-500">[Math Error]</span>\`; }
                });

                raw = raw.replace(/__CODE_BLOCK_(\\d+)__/g, (match, index) => {
                    const item = codeBlocks[index];
                    return \`<div class="my-3 bg-[#282c34] rounded-lg border border-gray-700 shadow-inner overflow-hidden text-left group relative select-none">
                        <div class="flex gap-1.5 px-3 py-2 border-b border-gray-700/50 bg-[#21252b]">
                            <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                        <div class="p-3 overflow-x-auto"><pre><code class="\${item.lang}">\${item.code}</code></pre></div>
                    </div>\`;
                });

                qStr.innerHTML = raw;
                qStr.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
                hint.innerText = d.hint;
                document.getElementById('cId').value = d.id;
                document.getElementById('cAns').value = '';

            } catch(e) {
                console.error(e);
                qStr.innerText = "Error loading captcha";
            } finally {
                qContainer.classList.remove('animate-pulse');
                qStr.classList.remove('opacity-50');
            }
        }

        async function verify() {
            const btn = document.getElementById('btn');
            const err = document.getElementById('err');
            const cId = document.getElementById('cId').value;
            const cAns = document.getElementById('cAns').value;

            btn.disabled = true;
            btn.innerText = "Verifying...";
            err.classList.add('hidden');

            try {
                const res = await fetch(\`\${API_HOST}/api/verify\`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ capId: cId, capAns: cAns })
                });

                const d = await res.json();

                if (d.success) {
                    btn.innerText = "Success! Redirecting...";
                    btn.classList.replace('bg-blue-600', 'bg-green-600');
                    setTimeout(() => location.reload(), 500);
                } else {
                    throw new Error(d.error || "Verification failed");
                }
            } catch (e) {
                err.innerText = e.message;
                err.classList.remove('hidden');
                btn.disabled = false;
                btn.innerText = "Verify";
                loadCap();
            }
        }
    </script>
</body>
</html>`;
}
