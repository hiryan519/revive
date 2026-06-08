export function resolveAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function buildBookmarkletHref(appUrl: string) {
  const apiUrl = `${appUrl.replace(/\/+$/, "").replace(/'/g, "\\'")}/api/bookmarklet-import`;
  const script = `(function(){var url=location.href;var api='${apiUrl}';function showToast(msg,isError){var existing=document.getElementById('revive-toast');if(existing)existing.remove();var toast=document.createElement('div');toast.id='revive-toast';toast.style.cssText=['position:fixed','bottom:24px','right:24px','padding:12px 20px','border-radius:8px','font-size:14px','font-family:sans-serif','color:#fff','z-index:999999','box-shadow:0 4px 12px rgba(0,0,0,0.15)','transition:opacity 0.3s','background:'+(isError?'#e53e3e':'#2D7DD2')].join(';');toast.innerText=msg;document.body.appendChild(toast);setTimeout(function(){toast.style.opacity='0';setTimeout(function(){toast.remove();},300);},3000);}showToast('正在加入最近收藏...');fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url})}).then(function(res){return res.json();}).then(function(data){if(data.success){showToast('✓ 已加入最近收藏');}else{showToast('导入失败：'+(data.error||'请稍后重试'),true);}}).catch(function(){showToast('网络错误，请检查 Revive 是否正在运行',true);});})();`;
  return `javascript:${script}`;
}
