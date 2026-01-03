export async function onRequest({ request }) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/|\/$/g, "");
  const staticExtRegex = /\.(css|js|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|map|txt)$/i;
  // 包含常见静态目录的前缀 
  const staticDirs = ['/assets/', '/static/', '/favicon.ico'];

  //  判断是否为静态资源
  const isStaticAsset = 
    staticExtRegex.test(url.pathname) || 
    staticDirs.some(dir => url.pathname.startsWith(dir));

  if (isStaticAsset) {
    return fetch(request);
  }

  if (!slug || slug.startsWith("api/") || slug === "favicon.ico") {
    return new Response("Not Found", { status: 404 });
  }

  const LinkDB = globalThis.LINK_KV;
  if (!LinkDB) return new Response("KV Error", { status: 500 });

  try {
    const raw = await LinkDB.get(slug);
    if (!raw) return new Response("Link Not Found", { status: 404 });

    let targetUrl = raw;
    
    // 尝试解析 JSON (兼容旧数据)
    try {
      const data = JSON.parse(raw);
      
      // 只有当数据是对象且包含 expireAt 时才进行 TTL 检查
      if (typeof data === 'object' && data.url && data.expireAt) {
        // [核心逻辑] 惰性过期检查
        if (Date.now() > data.expireAt) {
          // 已过期：异步删除该 Key (Lazy Delete)
          // 注意：不等待删除完成直接返回 404，提高响应速度
          LinkDB.delete(slug).catch(console.error);
          return new Response("Link Expired", { status: 404 });
        }
        targetUrl = data.url;
      }
    } catch (e) {
      // 解析失败说明是旧格式的纯字符串 URL，视为永久有效，不做处理
    }

    return Response.redirect(targetUrl, 302);

  } catch (e) {
    return new Response("Server Error", { status: 500 });
  }
}