
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
  const hostname = url.searchParams.get('hostname') || url.hostname;
  const clientIP = request.headers.get("EO-Client-IP") || "1.1.1.1";
  const zoneID = request.headers.get("EO-Zone-ID") || "UNKNOWN";

  const html = getCaptchaPage(hostname, clientIP, zoneID);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

function getCaptchaPage(hostname, clientIP, zoneID) {
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
/* CF Mock Styles Preserved but Cleaned for conflicts */
.bg-gradient-gray{background-image:-webkit-linear-gradient(top,#dedede,#ebebeb 3%,#ebebeb 97%,#dedede)}
.cf-error-source:after{position:absolute;--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));width:2.5rem;height:2.5rem;transform:translateX(-50%) translateY(0) rotate(45deg);content:"";bottom:-1.75rem;left:50%;box-shadow:0 0 4px 4px #dedede}
@media screen and (max-width:720px){.cf-error-source:after{display:none}}
.cf-icon-browser{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20100%2080.7362%22%3E%3Cpath%20d%3D%22M89.8358.1636H10.1642C4.6398.1636.1614%2C4.6421.1614%2C10.1664v60.4033c0%2C5.5244%2C4.4784%2C10.0028%2C10.0028%2C10.0028h79.6716c5.5244%2C0%2C10.0027-4.4784%2C10.0027-10.0028V10.1664c0-5.5244-4.4784-10.0028-10.0027-10.0028ZM22.8323%2C9.6103c1.9618%2C0%2C3.5522%2C1.5903%2C3.5522%2C3.5521s-1.5904%2C3.5522-3.5522%2C3.5522-3.5521-1.5904-3.5521-3.5522%2C1.5903-3.5521%2C3.5521-3.5521ZM12.8936%2C9.6103c1.9618%2C0%2C3.5522%2C1.5903%2C3.5522%2C3.5521s-1.5904%2C3.5522-3.5522%2C3.5522-3.5521-1.5904-3.5521-3.5522%2C1.5903-3.5521%2C3.5521-3.5521ZM89.8293%2C70.137H9.7312V24.1983h80.0981v45.9387ZM89.8293%2C16.1619H29.8524v-5.999h59.977v5.999Z%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}
.cf-icon-cloud{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20152%2078.9141%22%3E%3Cpath%20d%3D%22M132.2996%2C77.9927v-.0261c10.5477-.2357%2C19.0305-8.8754%2C19.0305-19.52%2C0-10.7928-8.7161-19.5422-19.4678-19.5422-2.9027%2C0-5.6471.6553-8.1216%2C1.7987C123.3261%2C18.6624%2C105.3419.9198%2C83.202.9198c-17.8255%2C0-32.9539%2C11.5047-38.3939%2C27.4899-3.0292-2.2755-6.7818-3.6403-10.8622-3.6403-10.0098%2C0-18.1243%2C8.1145-18.1243%2C0%2C1.7331.258%2C3.4033.7122%2C4.9905-.2899-.0168-.5769-.0442-.871-.0442-8.2805%2C0-14.993%2C6.7503-14.993%2C15.0772%2C0%2C8.2795%2C6.6381%2C14.994%2C14.8536%2C15.0701v.0054h.1069c.0109%2C0%2C.0215.0016.0325.0016s.0215-.0016.0325-.0016%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}
.cf-icon-server{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2095%2075%22%3E%3Cpath%20d%3D%22M94.0103%2C45.0775l-12.9885-38.4986c-1.2828-3.8024-4.8488-6.3624-8.8618-6.3619l-49.91.0065c-3.9995.0005-7.556%2C2.5446-8.8483%2C6.3295L1.0128%2C42.8363c-.3315.971-.501%2C1.9899-.5016%2C3.0159l-.0121%2C19.5737c-.0032%2C5.1667%2C4.1844%2C9.3569%2C9.3513%2C9.3569h75.2994c5.1646%2C0%2C9.3512-4.1866%2C9.3512-9.3512v-17.3649c0-1.0165-.1657-2.0262-.4907-2.9893ZM86.7988%2C65.3097c0%2C1.2909-1.0465%2C2.3374-2.3374%2C2.3374H9.9767c-1.2909%2C0-2.3374-1.0465-2.3374-2.3374v-18.1288c0-1.2909%2C1.0465-2.3374%2C2.3374-2.3374h74.4847c1.2909%2C0%2C2.3374%2C1.0465%2C2.3374%2C2.3374v18.1288Z%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3Ccircle%20cx%3D%2274.6349%22%20cy%3D%2256.1889%22%20r%3D%224.7318%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3Ccircle%20cx%3D%2259.1472%22%20cy%3D%2256.1889%22%20r%3D%224.7318%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}
.cf-icon-ok{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2048%2048%22%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%2223.4815%22%20style%3D%22fill%3A%20%239bca3e%3B%22/%3E%3Cpolyline%20points%3D%2217.453%2024.9841%2021.7183%2030.4504%2030.2076%2016.8537%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%204px%3B%22/%3E%3C/svg%3E)}
.cf-icon-error{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2047.9145%2047.9641%22%3E%3Ccircle%20cx%3D%2223.9572%22%20cy%3D%2223.982%22%20r%3D%2223.4815%22%20style%3D%22fill%3A%20%23bd2426%3B%22/%3E%3Cline%20x1%3D%2219.0487%22%20y1%3D%2219.0768%22%20x2%3D%2227.8154%22%20y2%3D%2228.8853%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%203px%3B%22/%3E%3Cline%20x1%3D%2227.8154%22%20y1%3D%2219.0768%22%20x2%3D%2219.0487%22%20y2%3D%2228.8853%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%203px%3B%22/%3E%3C/svg%3E)}

/* Overrides/Utilities */
.code-label{background-color:#d9d9d9;color:#313131;font-weight:500;border-radius:1.25rem;font-size:.75rem;line-height:4.5rem;padding:.25rem .5rem;height:4.5rem;white-space:nowrap;vertical-align:middle}
.spoiler{background-color:#1f2937;color:#1f2937;border-radius:4px;padding:0 4px;cursor:help;transition:all 0.2s ease;user-select:none}
.spoiler:hover{background-color:transparent;color:#9ca3af}
.hljs { background: transparent !important; padding: 0 !important; }
.katex { font-size: 1.1em; }
</style>
</head>
<body class="font-sans text-gray-700 antialiased">
<div id="cf-wrapper">
    <div id="cf-error-details" class="p-0">
        <header class="mx-auto pt-6 lg:px-8 w-[60rem] lg:w-full mb-2">
            <h1 class="inline-block sm:block sm:mb-2 font-light text-[60px] lg:text-4xl text-[#404040] leading-tight mr-2">
                <span class="inline-block">LOOP Captcha required</span>
                <span class="code-label">Error code 200</span>
            </h1>
            <div>
                Visit <a href="https://www.s3xyseia.xyz" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-orange-400">www.s3xyseia.xyz</a> for guest guidelines.
            </div>
            <div class="mt-2 text-gray-500"><span id="jst-time">Loading time...</span></div>
        </header>

        <!-- Captcha Container: Horizontal Compact Design -->
        <div class="w-[60rem] lg:w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div class="flex flex-col md:flex-row h-full">
                <!-- Left: Puzzle/Question Area -->
                <div class="md:w-3/5 p-6 bg-gray-50 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div class="flex items-center justify-between mb-2 select-none">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Challenge</span>
                        <button onclick="loadCap()" class="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Refresh
                        </button>
                    </div>
                    <div id="qStr" class="font-mono text-sm text-gray-800 break-words min-h-[60px] flex items-center">Loading puzzle...</div>
                </div>

                <!-- Right: Controls Area -->
                <div class="md:w-2/5 p-6 bg-white flex flex-col justify-center gap-4">
                     <!-- Badge -->
                    <div class="bg-gray-50 border border-gray-200 rounded p-2 flex justify-between items-center select-none shadow-sm h-14">
                        <div class="flex items-center gap-3">
                            <div class="w-6 h-6 bg-white border-2 border-gray-300 rounded-sm flex items-center justify-center">
                                <svg class="w-4 h-4 text-green-500 animate-[bounce_0.5s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <span class="text-xs font-medium text-gray-600">I'm not a robot</span>
                        </div>
                        <div class="flex flex-col items-center opacity-70">
                             <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                            <span class="text-[5px] text-gray-500 mt-0.5">reCAPTCHA</span>
                        </div>
                    </div>

                    <!-- Input & Action -->
                    <div>
                        <div class="flex gap-2 mb-1">
                            <input type="text" id="cAns" placeholder="Type answer..." class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
                            <button onclick="verify()" id="btn" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                Verify
                            </button>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                             <div class="text-red-500 hidden" id="err"></div>
                             <div class="text-gray-400 ml-auto">Hint: <span id="cHint" class="spoiler">...</span></div>
                        </div>
                    </div>
                    <input type="hidden" id="cId">
                </div>
            </div>
            <div class="bg-gray-100 border-t border-gray-200 px-4 py-1.5 text-center">
                <p class="text-[10px] text-gray-400">Protected by EdgeOne Functions • <span class="font-mono">${hostname}</span></p>
            </div>
        </div>

        <div class="my-6 bg-gradient-gray">
            <div class="w-[60rem] lg:w-full mx-auto">
                <div class="flex flex-col md:flex-row md:px-8 text-center text-[#404040]">
                    <!-- Browser -->
                    <div class="relative w-full md:w-1/3 py-8 md:text-left border-b md:border-b-0 md:border-r border-gray-300/50">
                         <div class="relative mb-4 md:m-0 md:float-left md:mr-4">
                            <span class="cf-icon-browser block md:hidden h-20 bg-center bg-no-repeat"></span>
                            <span class="cf-icon-error w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4 hidden md:block"></span>
                        </div>
                         <div class="md:overflow-hidden">
                             <span class="md:block w-full truncate font-light">You</span>
                             <h3 class="md:inline-block mt-3 md:mt-0 text-xl text-gray-600 font-light" >Browser</h3>
                             <span class="block text-xl text-[#bd2426]">Mamba out</span>
                         </div>
                    </div>
                    <!-- Cloud -->
                    <div class="relative w-full md:w-1/3 py-8 md:text-left border-b md:border-b-0 md:border-r border-gray-300/50">
                         <div class="relative mb-4 md:m-0 md:float-left md:mr-4">
                             <span class="cf-icon-cloud block md:hidden h-20 bg-center bg-no-repeat"></span>
                             <span class="cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4 hidden md:block"></span>
                         </div>
                         <div class="md:overflow-hidden">
                             <span class="md:block w-full truncate font-light">Tencent Edgeone</span>
                             <h3 class="md:inline-block mt-3 md:mt-0 text-xl text-gray-600 font-light" >LOOP Cloud</h3>
                             <span class="block text-xl text-[#9bca3e]">Request Intercpted</span>
                         </div>
                    </div>
                    <!-- Host -->
                    <div class="relative w-full md:w-1/3 py-8 md:text-left">
                         <div class="relative mb-4 md:m-0 md:float-left md:mr-4">
                             <span class="cf-icon-server block md:hidden h-20 bg-center bg-no-repeat"></span>
                             <span class="cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4 hidden md:block"></span>
                         </div>
                         <div class="md:overflow-hidden">
                             <span class="md:block w-full truncate font-light">${hostname}</span>
                             <h3 class="md:inline-block mt-3 md:mt-0 text-xl text-gray-600 font-light" >Host</h3>
                             <span class="block text-xl text-[#9bca3e]">Working</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-[60rem] lg:w-full mx-auto mb-8 lg:px-8">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/2 leading-relaxed">
                    <h2 class="text-3xl font-normal mb-4">What happened?</h2>
                    <p class="text-[15px]">Robots/Low-sanity commonalty should stay out.</p>
                </div>
                <div class="w-full md:w-1/2 leading-relaxed">
                    <h2 class="text-3xl font-normal mb-4">What can I do?</h2>
                    <p class="text-[15px]">Do the captcha to prove you are human (and welcome or not).</p>
                </div>
            </div>
        </div>

        <div class="w-[60rem] lg:w-full py-4 mx-auto text-center sm:text-left border-t border-gray-300">
            <p class="text-[13px] text-gray-600">
                <span class="block sm:inline sm:mr-2">Ray ID: <strong class="font-semibold text-black">${zoneID}</strong></span>
                <span class="hidden sm:inline">&bull;</span>
                <span id="cf-footer-item-ip" class="block sm:inline sm:ml-2">
                    Your IP:
                    <button type="button" id="cf-footer-ip-reveal" class="text-blue-600 hover:text-orange-500 bg-transparent border-0 p-0 cursor-pointer transition">Click to reveal</button>
                    <span class="hidden" id="cf-footer-ip">${clientIP}</span>
                </span>
                <span class="block sm:mt-1">Performance &amp; security by <a rel="noopener noreferrer" href="https://www.s3xyseia.xyz" target="_blank" class="text-blue-600 hover:text-orange-500">LOOP Edge Functions</a></span>
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
                return \`<div class="my-2 bg-[#282c34] rounded border border-gray-700 shadow-inner overflow-hidden text-left group relative select-none text-xs">
                    <div class="flex gap-1 px-2 py-1 border-b border-gray-700/50 bg-[#21252b]">
                        <div class="w-2 h-2 rounded-full bg-red-500/80"></div>
                        <div class="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                        <div class="w-2 h-2 rounded-full bg-green-500/80"></div>
                    </div>
                    <div class="p-2 overflow-x-auto"><pre><code class="\${item.lang}">\${item.code}</code></pre></div>
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
