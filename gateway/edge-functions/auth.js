
const CONFIG = {
    title: "LOOP CAPTCHA",
    gatewayUrl: "https://captcha.s3xyseia.xyz",
    cookieName: "_captcha_sess",
    icon: `
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" role="img" aria-label="captcha">
                    <rect x="3" y="7" width="18" height="13" rx="2" ry="2" stroke-linejoin="round"></rect>
                    <path d="M7 7V5a5 5 0 0 1 10 0v2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M9 13l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>`
};

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const rawHostname = url.searchParams.get('hostname') || url.hostname;
  const hostname = rawHostname.replace(/[<>"'&]/g, ""); // Basic XSS prevention

  // Use passed query params for Ray ID and IP, falling back only if missing
  const rawRayId = url.searchParams.get('rayid') || "UNKNOWN";
  const rawClientIP = url.searchParams.get('ip') || "UNKNOWN";

  // Sanitize inputs
  const rayId = rawRayId.replace(/[<>"'&]/g, "");
  const clientIP = rawClientIP.replace(/[<>"'&]/g, "");

  const html = getCaptchaPage(hostname, clientIP, rayId);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

function getCaptchaPage(hostname, clientIP, rayId) {
  return `<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en-US"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en-US"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en-US"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en-US"> <!--<![endif]-->
<head>
<title>200: LOOP Captcha required</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta name="robots" content="noindex, nofollow" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
/* Utilities */
.bg-gradient-gray{background-image:-webkit-linear-gradient(top,#dedede,#ebebeb 3%,#ebebeb 97%,#dedede)}
.code-label{background-color:#d9d9d9;color:#313131;font-weight:500;border-radius:1.25rem;font-size:.75rem;line-height:4.5rem;padding:.25rem .5rem;height:4.5rem;white-space:nowrap;vertical-align:middle}
.spoiler{background-color:#1f2937;color:#1f2937;border-radius:4px;padding:0 4px;cursor:help;transition:all 0.2s ease;user-select:none}
.spoiler:hover{background-color:transparent;color:#9ca3af}
.hljs { background: transparent !important; padding: 0 !important; }
.katex { font-size: 1.1em; }
/* Make injected code-block wrappers span side-to-side within the question column */
#qStr .my-4 { margin-left: -2rem; margin-right: -2rem; padding-left: 2rem; padding-right: 2rem; box-sizing: border-box; }
</style>
</head>
<body class="font-sans text-gray-700 antialiased h-screen flex flex-col overflow-hidden">
<div id="cf-wrapper" class="flex-grow flex flex-col">
    <div id="cf-error-details" class="p-0 flex flex-col flex-grow">
        <!-- Header: Responsive Wider Width (85rem) -->
        <header class="mx-auto pt-4 px-4 lg:px-8 w-full max-w-[85rem] mb-2 flex-shrink-0">
            <h1 class="inline-block sm:block sm:mb-2 font-light text-[60px] text-[#404040] leading-tight mr-2">
                <span class="inline-block">LOOP Captcha required</span>
                <span class="code-label">Error code 200</span>
            </h1>
            <div class="text-base text-gray-600">
                Visit <a href="https://www.s3xyseia.xyz" target="_blank" rel="noopener noreferrer" class="text-[#2f7bbf] hover:text-[#f68b1f]">www.s3xyseia.xyz</a> for guest guidelines.
            </div>
            <div class="mt-1 text-gray-500 text-base"><span id="jst-time">Loading time...</span></div>
        </header>

        <!-- Captcha Container Wrapper -->
        <div class="w-full max-w-[80rem] mx-auto mb-4 px-4 lg:px-0 flex-shrink-0">
            <!-- Captcha Card Inner: Fixed Size (max-w-4xl) -->
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform scale-100 origin-top">
                <div class="flex flex-col md:flex-row min-h-[300px]">
                    <!-- Left: Puzzle/Question Area (Magnified) -->
                    <div class="md:w-3/5 p-8 bg-gray-50 flex flex-col justify-top border-b md:border-b-0 md:border-r border-gray-200">
                        <div class="flex items-center justify-between mb-4 select-none">
                            <span class="text-sm font-bold text-gray-400 uppercase tracking-wider">Challenge</span>
                            <button onclick="loadCap()" class="text-blue-500 hover:text-blue-700 text-base flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                Refresh
                            </button>
                        </div>
                        <div id="qStr" class="font-mono text-xl text-gray-800 break-words flex items-center leading-relaxed">Loading puzzle...</div>
                    </div>

                    <!-- Right: Controls Area (Magnified) -->
                    <div class="md:w-2/5 p-8 bg-white flex flex-col justify-center gap-6">
                         <!-- Badge -->
                        <div class="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center select-none shadow-sm h-20">
                            <div class="flex items-center gap-4">
                                <div class="w-8 h-8 bg-white border-2 border-gray-300 rounded-sm flex items-center justify-center">
                                    <svg class="w-5 h-5 text-green-500 delay-500 animate-[bounce_1.5s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <span class="text-lg font-medium text-gray-600">I'm not a robot</span>
                            </div>
                            <div class="flex flex-col items-center opacity-70">
                                 <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                                <span class="text-[8px] text-gray-500 mt-0.5">reCAPTCHA</span>
                            </div>
                        </div>

                        <!-- Input & Action -->
                        <div>
                            <div class="flex flex-col gap-3 mb-2">
                                <input type="text" id="cAns" placeholder="Type answer..." class="w-full border border-gray-300 rounded px-4 py-3 text-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
                                <button onclick="verify()" id="btn" class="w-full bg-blue-600 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    Verify
                                </button>
                            </div>
                            <div class="flex justify-between items-center text-sm mt-2">
                                 <div class="text-red-500 hidden" id="err"></div>
                                 <div class="text-gray-400 ml-auto">Hint: <span id="cHint" class="spoiler text-base">...</span></div>
                            </div>
                        </div>
                        <input type="hidden" id="cId">
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Panel: Centered Content, Wider (85rem) -->
        <div class="my-4 bg-gradient-gray flex-shrink-0">
            <div class="w-full max-w-[80rem] mx-auto px-4 lg:px-0">
                <div class="flex flex-col md:flex-row text-center text-[#404040]">
                    <!-- Browser -->
                    <div class="relative w-full md:w-1/3 py-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300/50">
                         <div class="mb-4 h-24 w-full flex justify-center relative">
                             <!-- Icon -->
                            <svg class="h-20 w-auto text-gray-400" viewBox="0 0 100 80" fill="currentColor">
                                <path d="M89.8 0.2H10.2C4.6 0.2 0.2 4.6 0.2 10.2v60.4c0 5.5 4.5 10 10 10h79.7c5.5 0 10-4.5 10-10V10.2c0-5.5-4.5-10-10-10zM22.8 9.6c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6zM12.9 9.6c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6zM89.8 70.1H9.7V24.2h80.1v45.9zM89.8 16.2H29.9v-6h60v6z"/>
                            </svg>
                            <!-- Error X Overlay -->
                            <div class="absolute bottom-0 left-1/2 ml-5 bg-white rounded-full p-1 shadow-sm">
                                <svg class="w-8 h-8 text-[#bd2426]" fill="currentColor" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23"/><path fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" d="M17 17l14 14M31 17L17 31"/></svg>
                            </div>
                        </div>
                        <div class="w-full">
                             <span class="block w-full truncate font-light">You</span>
                             <h3 class="block mt-1 text-xl text-gray-600 font-light" >Browser</h3>
                             <span class="block text-xl text-[#bd2426]">Mamba out</span>
                         </div>
                         <!-- Pointer/Arrow -->
                         <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#ebebeb] rotate-45 border-r border-b border-transparent shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.1)] z-10"></div>
                    </div>
                    <!-- Cloud -->
                    <div class="relative w-full md:w-1/3 py-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300/50">
                         <div class="mb-4 h-24 w-full flex justify-center relative">
                             <!-- Icon -->
                             <svg class="h-20 w-auto text-gray-400" viewBox="0 0 640 512" fill="currentColor">
                                 <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4z"/>
                             </svg>
                             <!-- Check Overlay -->
                            <div class="absolute bottom-0 left-1/2 ml-5 bg-white rounded-full p-1 shadow-sm">
                                <svg class="w-8 h-8 text-[#9bca3e]" fill="currentColor" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23"/><path fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M17 25l5 5 9-14"/></svg>
                            </div>
                         </div>
                         <div class="w-full">
                             <span class="block w-full truncate font-light">Tencent Edgeone</span>
                             <h3 class="block mt-1 text-xl text-gray-600 font-light" >LOOP Cloud</h3>
                             <span class="block text-xl text-[#9bca3e]">Request Intercepted</span>
                         </div>
                    </div>
                    <!-- Host -->
                    <div class="relative w-full md:w-1/3 py-6 flex flex-col items-center justify-center">
                         <div class="mb-4 h-24 w-full flex justify-center relative">
                             <!-- Icon -->
                             <svg class="h-20 w-auto text-gray-400" viewBox="0 0 95 75" fill="currentColor">
                                 <path d="M94 45.1l-13-38.5c-1.3-3.8-4.8-6.4-8.9-6.4L22.2 0.2c-4 0-7.6 2.5-8.8 6.3L1 42.8c-0.3 1-0.5 2-0.5 3l0 19.6c0 5.2 4.2 9.4 9.4 9.4h75.3c5.2 0 9.4-4.2 9.4-9.4V48.1c0-1-0.2-2-0.5-3zM86.8 65.3c0 1.3-1 2.3-2.3 2.3H10c-1.3 0-2.3-1-2.3-2.3V47.2c0-1.3 1-2.3 2.3-2.3h74.5c1.3 0 2.3 1 2.3 2.3v18.1z"/>
                                 <circle cx="74.6" cy="56.2" r="4.7"/><circle cx="59.1" cy="56.2" r="4.7"/>
                             </svg>
                             <!-- Check Overlay -->
                            <div class="absolute bottom-0 left-1/2 ml-5 bg-white rounded-full p-1 shadow-sm">
                                <svg class="w-8 h-8 text-[#9bca3e]" fill="currentColor" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23"/><path fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M17 25l5 5 9-14"/></svg>
                            </div>
                         </div>
                         <div class="w-full">
                             <span class="block w-full truncate font-light">${hostname}</span>
                             <h3 class="block mt-1 text-xl text-gray-600 font-light" >Host</h3>
                             <span class="block text-xl text-[#9bca3e]">Working</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ: Wider (80rem) -->
        <div class="w-full max-w-[80rem] mx-auto mt-8 mb-4 px-4 lg:px-8 flex-shrink-0">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/2 leading-relaxed">
                    <h2 class="text-3xl font-normal mb-2">What happened?</h2>
                    <p class="text-[15px]">Robots/Low-sanity commonalty should stay out.</p>
                </div>
                <div class="w-full md:w-1/2 leading-relaxed">
                    <h2 class="text-3xl font-normal mb-2">What can I do?</h2>
                    <p class="text-[15px]">Do the captcha to prove you are human (and welcome or not).</p>
                </div>
            </div>
        </div>

        <!-- Footer: Fixed at bottom via flex-grow/mt-auto -->
        <div class="mt-auto w-full max-w-[80rem] py-4 mx-auto text-center border-t border-gray-300 px-4 lg:px-0 bg-white">
            <p class="text-[13px] text-gray-600">
                <span class="inline-block mr-2">Ray ID: <strong class="font-semibold text-black">${rayId}</strong></span>
                <span class="inline-block mr-2">&bull;</span>
                <span id="cf-footer-item-ip" class="inline-block mr-2">
                    Your IP:
                    <button type="button" id="cf-footer-ip-reveal" class="text-blue-600 hover:text-orange-500 bg-transparent border-0 p-0 cursor-pointer transition">Click to reveal</button>
                    <span class="hidden" id="cf-footer-ip">${clientIP}</span>
                </span>
                <span class="inline-block mr-2">&bull;</span>
                <span class="inline-block">Performance &amp; security by <a rel="noopener noreferrer" href="https://www.s3xyseia.xyz" target="_blank" class="text-blue-600 hover:text-orange-500">LOOP Edge Functions</a></span>
            </p>
        </div>
    </div>
</div>
<script>
    const API_HOST = "${CONFIG.gatewayUrl}";

    // JST Clock
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat('en-CA', options);
        const isoLike = formatter.format(now).replace(',', '');
        document.getElementById('jst-time').innerText = isoLike + ' JST';
    }
    setInterval(updateTime, 1000);
    updateTime();

    // IP Reveal
    (function(){
        function d(){
            var c=document.getElementById("cf-footer-ip-reveal");
            if(c){
                c.addEventListener("click",function(){
                    c.classList.add("hidden");
                    document.getElementById("cf-footer-ip").classList.remove("hidden");
                });
            }
        }
        document.addEventListener&&document.addEventListener("DOMContentLoaded",d);
    })();

    // Captcha Logic
    document.addEventListener('DOMContentLoaded', loadCap);

    async function loadCap() {
        const qStr = document.getElementById('qStr');
        const hint = document.getElementById('cHint');
        const err = document.getElementById('err');

        err.classList.add('hidden');
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
                '<code class="bg-indigo-50 text-indigo-600 px-1.5 rounded border border-indigo-100 font-mono text-lg mx-1">$1</code>'
            );

            raw = raw.replace(/__LATEX_(\\d+)__/g, (match, index) => {
                const item = latexBlocks[index];
                try {
                    return katex.renderToString(item.tex, { displayMode: item.displayMode, throwOnError: false });
                } catch (err) { return \`<span class="text-red-500">[Math Error]</span>\`; }
            });

            raw = raw.replace(/__CODE_BLOCK_(\\d+)__/g, (match, index) => {
                const item = codeBlocks[index];
                    // Prepend a line break before code block to ensure separation from previous content
                    return \`<br><div class="my-4 bg-[#282c34] rounded border border-gray-700 shadow-inner overflow-hidden text-left group relative select-none text-base">
                        <div class="flex gap-2 px-3 py-2 border-b border-gray-700/50 bg-[#21252b]">
                            <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                        <div class="p-4 overflow-x-auto"><pre><code class="\${item.lang}">\${item.code}</code></pre></div>
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
            qStr.classList.remove('opacity-50');
        }
    }

    async function verify() {
        const btn = document.getElementById('btn');
        const err = document.getElementById('err');
        const cId = document.getElementById('cId').value;
        const cAns = document.getElementById('cAns').value;

        btn.disabled = true;
        btn.innerText = "...";
        err.classList.add('hidden');
        err.innerText = "";

        try {
            const res = await fetch(\`\${API_HOST}/api/verify\`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ capId: cId, capAns: cAns })
            });

            const d = await res.json();

            if (d.success) {
                btn.innerText = "OK";
                btn.classList.replace('bg-blue-600', 'bg-green-600');

                const nextUrl = new URLSearchParams(window.location.search).get('next');
                setTimeout(() => {
                    if (nextUrl) {
                        window.location.href = nextUrl;
                    } else {
                        alert("Verification successful.");
                    }
                }, 500);
            } else {
                throw new Error(d.error || "Failed");
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
