
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
.container{width:100%}.bg-white{--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity))}.bg-center{background-position:50%}.bg-no-repeat{background-repeat:no-repeat}.border-gray-300{--border-opacity:1;border-color:#ebebeb;border-color:rgba(235,235,235,var(--border-opacity))}.rounded{border-radius:.25rem}.border-solid{border-style:solid}.border-0{border-width:0}.border{border-width:1px}.border-t{border-top-width:1px}.cursor-pointer{cursor:pointer}.block{display:block}.inline-block{display:inline-block}.table{display:table}.hidden{display:none}.float-left{float:left}.clearfix:after{content:"";display:table;clear:both}.font-mono{font-family:monaco,courier,monospace}.font-light{font-weight:300}.font-normal{font-weight:400}.font-semibold{font-weight:600}.h-12{height:3rem}.h-20{height:5rem}.text-13{font-size:13px}.text-15{font-size:15px}.text-60{font-size:60px}.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem}.leading-tight{line-height:1.25}.leading-normal{line-height:1.5}.leading-relaxed{line-height:1.625}.leading-1\.3{line-height:1.3}.my-8{margin-top:2rem;margin-bottom:2rem}.mx-auto{margin-left:auto;margin-right:auto}.mr-2{margin-right:.5rem}.mb-2{margin-bottom:.5rem}.mt-3{margin-top:.75rem}.mb-4{margin-bottom:1rem}.ml-4{margin-left:1rem}.mt-6{margin-top:1.5rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mb-10{margin-bottom:2.5rem}.ml-10{margin-left:2.5rem}.mb-15{margin-bottom:3.75rem}.-ml-6{margin-left:-1.5rem}.overflow-hidden{overflow:hidden}.p-0{padding:0}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-8{padding-top:2rem;padding-bottom:2rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.py-15{padding-top:3.75rem;padding-bottom:3.75rem}.pr-6{padding-right:1.5rem}.pt-10{padding-top:2.5rem}.absolute{position:absolute}.relative{position:relative}.left-1\/2{left:50%}.-bottom-4{bottom:-1rem}.resize{resize:both}.text-center{text-align:center}.text-black-dark{--text-opacity:1;color:#404040;color:rgba(64,64,64,var(--text-opacity))}.text-gray-600{--text-opacity:1;color:#999;color:rgba(153,153,153,var(--text-opacity))}.text-red-error{--text-opacity:1;color:#bd2426;color:rgba(189,36,38,var(--text-opacity))}.text-green-success{--text-opacity:1;color:#9bca3e;color:rgba(155,202,62,var(--text-opacity))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.w-12{width:3rem}.w-240{width:60rem}.w-1\/2{width:50%}.w-1\/3{width:33.333333%}.w-full{width:100%}.transition{-webkit-transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,-webkit-transform;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,-webkit-transform;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,-webkit-transform}body,html{--text-opacity:1;color:#404040;color:rgba(64,64,64,var(--text-opacity));-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:16px}*,body,html{margin:0;padding:0}*{box-sizing:border-box}a{--text-opacity:1;color:#2f7bbf;color:rgba(47,123,191,var(--text-opacity));text-decoration:none;-webkit-transition-property:all;transition-property:all;-webkit-transition-duration:.15s;transition-duration:.15s;-webkit-transition-timing-function:cubic-bezier(0,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1)}a:hover{--text-opacity:1;color:#f68b1f;color:rgba(246,139,31,var(--text-opacity))}img{display:block;width:100%;height:auto}#what-happened-section p{font-size:15px;line-height:1.5}strong{font-weight:600}.bg-gradient-gray{background-image:-webkit-linear-gradient(top,#dedede,#ebebeb 3%,#ebebeb 97%,#dedede)}.cf-error-source:after{position:absolute;--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));width:2.5rem;height:2.5rem;--transform-translate-x:0;--transform-translate-y:0;--transform-rotate:0;--transform-skew-x:0;--transform-skew-y:0;--transform-scale-x:1;--transform-scale-y:1;-webkit-transform:translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y));-ms-transform:translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y));transform:translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y));--transform-rotate:45deg;content:"";bottom:-1.75rem;left:50%;margin-left:-1.25rem;box-shadow:0 0 4px 4px #dedede}@media screen and (max-width:720px){.cf-error-source:after{display:none}}.cf-icon-browser{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20100%2080.7362%22%3E%3Cpath%20d%3D%22M89.8358.1636H10.1642C4.6398.1636.1614%2C4.6421.1614%2C10.1664v60.4033c0%2C5.5244%2C4.4784%2C10.0028%2C10.0028%2C10.0028h79.6716c5.5244%2C0%2C10.0027-4.4784%2C10.0027-10.0028V10.1664c0-5.5244-4.4784-10.0028-10.0027-10.0028ZM22.8323%2C9.6103c1.9618%2C0%2C3.5522%2C1.5903%2C3.5522%2C3.5521s-1.5904%2C3.5522-3.5522%2C3.5522-3.5521-1.5904-3.5521-3.5522%2C1.5903-3.5521%2C3.5521-3.5521ZM12.8936%2C9.6103c1.9618%2C0%2C3.5522%2C1.5903%2C3.5522%2C3.5521s-1.5904%2C3.5522-3.5522%2C3.5522-3.5521-1.5904-3.5521-3.5522%2C1.5903-3.5521%2C3.5521-3.5521ZM89.8293%2C70.137H9.7312V24.1983h80.0981v45.9387ZM89.8293%2C16.1619H29.8524v-5.999h59.977v5.999Z%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}.cf-icon-cloud{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20152%2078.9141%22%3E%3Cpath%20d%3D%22M132.2996%2C77.9927v-.0261c10.5477-.2357%2C19.0305-8.8754%2C19.0305-19.52%2C0-10.7928-8.7161-19.5422-19.4678-19.5422-2.9027%2C0-5.6471.6553-8.1216%2C1.7987C123.3261%2C18.6624%2C105.3419.9198%2C83.202.9198c-17.8255%2C0-32.9539%2C11.5047-38.3939%2C27.4899-3.0292-2.2755-6.7818-3.6403-10.8622-3.6403-10.0098%2C0-18.1243%2C8.1145-18.1243%2C18.1243%2C0%2C1.7331.258%2C3.4033.7122%2C4.9905-.2899-.0168-.5769-.0442-.871-.0442-8.2805%2C0-14.993%2C6.7503-14.993%2C15.0772%2C0%2C8.2795%2C6.6381%2C14.994%2C14.8536%2C15.0701v.0054h.1069c.0109%2C0%2C.0215.0016.0325.0016s.0215-.0016.0325-.0016%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}.cf-icon-server{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2095%2075%22%3E%3Cpath%20d%3D%22M94.0103%2C45.0775l-12.9885-38.4986c-1.2828-3.8024-4.8488-6.3624-8.8618-6.3619l-49.91.0065c-3.9995.0005-7.556%2C2.5446-8.8483%2C6.3295L1.0128%2C42.8363c-.3315.971-.501%2C1.9899-.5016%2C3.0159l-.0121%2C19.5737c-.0032%2C5.1667%2C4.1844%2C9.3569%2C9.3513%2C9.3569h75.2994c5.1646%2C0%2C9.3512-4.1866%2C9.3512-9.3512v-17.3649c0-1.0165-.1657-2.0262-.4907-2.9893ZM86.7988%2C65.3097c0%2C1.2909-1.0465%2C2.3374-2.3374%2C2.3374H9.9767c-1.2909%2C0-2.3374-1.0465-2.3374-2.3374v-18.1288c0-1.2909%2C1.0465-2.3374%2C2.3374-2.3374h74.4847c1.2909%2C0%2C2.3374%2C1.0465%2C2.3374%2C2.3374v18.1288Z%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3Ccircle%20cx%3D%2274.6349%22%20cy%3D%2256.1889%22%20r%3D%224.7318%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3Ccircle%20cx%3D%2259.1472%22%20cy%3D%2256.1889%22%20r%3D%224.7318%22%20style%3D%22fill%3A%20%23999%3B%22/%3E%3C/svg%3E)}.cf-icon-ok{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2048%2048%22%3E%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%2223.4815%22%20style%3D%22fill%3A%20%239bca3e%3B%22/%3E%3Cpolyline%20points%3D%2217.453%2024.9841%2021.7183%2030.4504%2030.2076%2016.8537%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%204px%3B%22/%3E%3C/svg%3E)}.cf-icon-error{background-image:url(data:image/svg+xml;utf8,%3Csvg%20id%3D%22a%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2047.9145%2047.9641%22%3E%3Ccircle%20cx%3D%2223.9572%22%20cy%3D%2223.982%22%20r%3D%2223.4815%22%20style%3D%22fill%3A%20%23bd2426%3B%22/%3E%3Cline%20x1%3D%2219.0487%22%20y1%3D%2219.0768%22%20x2%3D%2227.8154%22%20y2%3D%2228.8853%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%203px%3B%22/%3E%3Cline%20x1%3D%2227.8154%22%20y1%3D%2219.0768%22%20x2%3D%2219.0487%22%20y2%3D%2228.8853%22%20style%3D%22fill%3A%20none%3B%20stroke%3A%20%23fff%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%20stroke-width%3A%203px%3B%22/%3E%3C/svg%3E)}#cf-wrapper .feedback-hidden{display:none}#cf-wrapper .feedback-success{min-height:33px;line-height:33px}#cf-wrapper .cf-button{color:#0051c3;font-size:13px;border-color:#0045a6;-webkit-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-property:background-color,border-color,color;transition-property:background-color,border-color,color}#cf-wrapper .cf-button:hover{color:#fff;background-color:#003681}.cf-error-footer .hidden{display:none}.cf-error-footer .cf-footer-ip-reveal-btn{-webkit-appearance:button;-moz-appearance:button;appearance:button;text-decoration:none;background:none;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;color:#0051c3;-webkit-transition:color .15s ease;transition:color .15s ease}.cf-error-footer .cf-footer-ip-reveal-btn:hover{color:#ee730a}.code-label{background-color:#d9d9d9;color:#313131;font-weight:500;border-radius:1.25rem;font-size:.75rem;line-height:4.5rem;padding:.25rem .5rem;height:4.5rem;white-space:nowrap;vertical-align:middle}@media (max-width:639px){.sm\:block{display:block}.sm\:hidden{display:none}.sm\:mb-1{margin-bottom:.25rem}.sm\:mb-2{margin-bottom:.5rem}.sm\:py-4{padding-top:1rem;padding-bottom:1rem}.sm\:px-8{padding-left:2rem;padding-right:2rem}.sm\:text-left{text-align:left}}@media (max-width:720px){.md\:border-gray-400{--border-opacity:1;border-color:#dedede;border-color:rgba(222,222,222,var(--border-opacity))}.md\:border-solid{border-style:solid}.md\:border-0{border-width:0}.md\:border-b{border-bottom-width:1px}.md\:block{display:block}.md\:inline-block{display:inline-block}.md\:hidden{display:none}.md\:float-none{float:none}.md\:text-3xl{font-size:1.875rem}.md\:m-0{margin:0}.md\:mt-0{margin-top:0}.md\:mb-2{margin-bottom:.5rem}.md\:p-0{padding:0}.md\:py-8{padding-top:2rem;padding-bottom:2rem}.md\:px-8{padding-left:2rem;padding-right:2rem}.md\:pr-0{padding-right:0}.md\:pb-10{padding-bottom:2.5rem}.md\:top-0{top:0}.md\:right-0{right:0}.md\:left-auto{left:auto}.md\:text-left{text-align:left}.md\:w-full{width:100%}}@media (max-width:1023px){.lg\:text-sm{font-size:.875rem}.lg\:text-2xl{font-size:1.5rem}.lg\:text-4xl{font-size:2.25rem}.lg\:leading-relaxed{line-height:1.625}.lg\:px-8{padding-left:2rem;padding-right:2rem}.lg\:pt-6{padding-top:1.5rem}.lg\:w-full{width:100%}}
.spoiler{background-color:#1f2937;color:#1f2937;border-radius:4px;padding:0 4px;cursor:help;transition:all 0.2s ease;user-select:none}
.spoiler:hover{background-color:transparent;color:#9ca3af}
.hljs { background: transparent !important; padding: 0 !important; }
.katex { font-size: 1.1em; }
</style>
</head>
<body>
<div id="cf-wrapper">
    <div id="cf-error-details" class="p-0">
        <header class="mx-auto pt-5 lg:pt-6 lg:px-8 w-240 lg:w-full mb-4">
            <h1 class="inline-block sm:block sm:mb-2 font-light text-60 lg:text-4xl text-black-dark leading-tight mr-2">
                <span class="inline-block">LOOP Captcha required</span>
                <span class="code-label">Error code 200</span>
            </h1>
            <div>
                Visit <a href="https://www.s3xyseia.xyz" target="_blank" rel="noopener noreferrer">www.s3xyseia.xyz</a> for guest guidelines.
            </div>
            <div class="mt-3"><span id="jst-time">Loading time...</span></div>
        </header>

        <!-- Captcha Container -->
        <div class="max-w-md mx-auto w-full bg-white rounded-xl shadow-lg overflow-hidden mb-4">
            <div class="p-8 text-center border-b border-gray-100">
                 <div class="flex justify-center mb-4">${CONFIG.icon}</div>
                 <h1 class="text-xl font-bold text-gray-800 mb-2">${CONFIG.title}</h1>
                 <p class="text-sm text-gray-500">
                    Please complete the security check to access <br>
                    <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">${hostname}</span>
                 </p>
            </div>

            <div class="p-6 bg-gray-50">
                <!-- Captcha Inner -->
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

        <div class="my-4 bg-gradient-gray">
            <div class="w-240 lg:w-full mx-auto">
                <div class="clearfix md:px-8">
                    <div id="cf-browser-status" class="cf-error-source relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center">
                        <div class="relative mb-10 md:m-0">
                            <span class="cf-icon-browser block md:hidden h-20 bg-center bg-no-repeat"></span>
                            <span class="cf-icon-error w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4"></span>
                        </div>
                        <span class="md:block w-full truncate">You</span>
                        <h3 class="md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3" >Browser</h3>
                        <span class="leading-1.3 text-2xl" style="color: #bd2426">Mamba out</span>
                    </div>
                    <div id="cf-cloudflare-status" class=" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center">
                        <div class="relative mb-10 md:m-0">
                            <span class="cf-icon-cloud block md:hidden h-20 bg-center bg-no-repeat"></span>
                            <span class="cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4"></span>
                        </div>
                        <span class="md:block w-full truncate">Tencent Edgeone</span>
                        <h3 class="md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3" >LOOP Cloud</h3>
                        <span class="leading-1.3 text-2xl" style="color: #9bca3e">Request Intercpted</span>
                    </div>
                    <div id="cf-host-status" class=" relative w-1/3 md:w-full py-15 md:p-0 md:py-8 md:text-left md:border-solid md:border-0 md:border-b md:border-gray-400 overflow-hidden float-left md:float-none text-center">
                        <div class="relative mb-10 md:m-0">
                            <span class="cf-icon-server block md:hidden h-20 bg-center bg-no-repeat"></span>
                            <span class="cf-icon-ok w-12 h-12 absolute left-1/2 md:left-auto md:right-0 md:top-0 -ml-6 -bottom-4"></span>
                        </div>
                        <span class="md:block w-full truncate">${hostname}</span>
                        <h3 class="md:inline-block mt-3 md:mt-0 text-2xl text-gray-600 font-light leading-1.3" >Host</h3>
                        <span class="leading-1.3 text-2xl" style="color: #9bca3e">Working</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-240 lg:w-full mx-auto mb-8 lg:px-8">
            <div class="clearfix">
                <div class="w-1/2 md:w-full float-left pr-6 md:pb-10 md:pr-0 leading-relaxed">
                    <h2 class="text-3xl font-normal leading-1.3 mb-4">What happened?</h2>
                    Robots/Low-sanity commonalty should stay out.
                </div>
                <div class="w-1/2 md:w-full float-left leading-relaxed">
                    <h2 class="text-3xl font-normal leading-1.3 mb-4">What can I do?</h2>
                    Do the captcha to prove you are human (and welcome or not).
                </div>
            </div>
        </div>

        <div class="cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300">
            <p class="text-13">
                <span class="cf-footer-item sm:block sm:mb-1">Ray ID: <strong class="font-semibold">${zoneID}</strong></span>
                <span class="cf-footer-separator sm:hidden">&bull;</span>
                <span id="cf-footer-item-ip" class="cf-footer-item hidden sm:block sm:mb-1">
                    Your IP:
                    <button type="button" id="cf-footer-ip-reveal" class="cf-footer-ip-reveal-btn">Click to reveal</button>
                    <span class="hidden" id="cf-footer-ip">${clientIP}</span>
                    <span class="cf-footer-separator sm:hidden">&bull;</span>
                </span>

                <span class="cf-footer-item sm:block sm:mb-1"><span>Performance &amp; security by</span> <a rel="noopener noreferrer" href="https://www.s3xyseia.xyz" id="brand_link" target="_blank">LOOP Edge Functions</a></span>
            </p>
        </div><!-- /.error-footer -->
    </div>
</div>
<script>
    const API_HOST = "${CONFIG.gatewayUrl}";

    // JST Clock
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat('en-CA', options);
        // en-CA gives YYYY-MM-DD which matches the mock style
        const parts = formatter.formatToParts(now);
        // We can just use format() which returns "YYYY-MM-DD, HH:MM:SS" roughly, or construct it manually if needed.
        // Chrome en-CA: 2026-01-04, 01:34:24
        // Let's ensure strict formatting
        const isoLike = formatter.format(now).replace(',', '');
        document.getElementById('jst-time').innerText = isoLike + ' JST';
    }
    setInterval(updateTime, 1000);
    updateTime();

    // IP Reveal
    (function(){
        function d(){
            var b=document.getElementById("cf-footer-item-ip"),
                c=document.getElementById("cf-footer-ip-reveal");
            if(b&&"classList"in b){
                b.classList.remove("hidden");
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

                const nextUrl = new URLSearchParams(window.location.search).get('next');
                setTimeout(() => {
                    if (nextUrl) {
                        window.location.href = nextUrl;
                    } else {
                        // Fallback to home or show a message
                        alert("Verification successful. You can close this page.");
                    }
                }, 500);
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
