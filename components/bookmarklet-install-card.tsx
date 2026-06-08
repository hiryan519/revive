"use client";

import { useState } from "react";
import { ghost, primary, secondary } from "@/components/revive/helpers";

export function BookmarkletInstallCard({ bookmarkletHref }: { bookmarkletHref: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bookmarkletHref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_320px]">
      <section id="bookmarklet" className="relative overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,242,251,0.96))] px-5 py-5 shadow-[0_20px_46px_rgba(194,187,214,0.2),0_6px_18px_rgba(222,217,235,0.34),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-lg before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-12 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.78),transparent)]">
        <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-slate-900">安装步骤</h2>
        <div className="mt-5 space-y-3 text-[15px] leading-7 text-slate-600">
          <p>1. 优先尝试把“加入 Revive”按钮拖到书签栏。</p>
          <p>2. 如果拖拽后点击没反应，就复制下面这段书签代码。</p>
          <p>3. 在浏览器里手动新建一个书签，把“网址 / URL”替换成复制出来的完整代码。</p>
          <p>4. 书签的网址必须以 <code>javascript:</code> 开头，不能是普通网页链接。</p>
          <p>5. 测试时请在正常的 <code>http/https</code> 网页里点击，不要在新标签页、浏览器设置页、扩展页里点。</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={bookmarkletHref} className={primary}>
            拖到书签栏：加入 Revive
          </a>
          <button type="button" onClick={() => void handleCopy()} className={secondary}>
            {copied ? "已复制书签代码" : "复制书签代码"}
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">书签代码</label>
          <textarea
            readOnly
            value={bookmarkletHref}
            className="min-h-[180px] w-full resize-none rounded-[18px] border border-slate-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,241,250,0.96))] px-4 py-3 text-[12px] leading-6 text-slate-700 shadow-[0_8px_16px_rgba(224,219,235,0.26),inset_0_1px_0_rgba(255,255,255,0.84)] outline-none"
          />
        </div>
      </section>

      <aside className="relative overflow-hidden rounded-[22px] border border-white/65 bg-[linear-gradient(180deg,rgba(251,249,255,0.92),rgba(243,239,248,0.95))] px-5 py-5 shadow-[0_16px_34px_rgba(200,193,220,0.18),0_4px_14px_rgba(227,222,238,0.32),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-10 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.7),transparent)]">
        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">排查</div>
        <div className="mt-4 space-y-3 text-[14px] leading-6 text-slate-600">
          <div className="rounded-[18px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.022))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            如果点击书签完全没反应，通常是书签实际保存成了普通链接，而不是 <code>javascript:</code> 代码。
          </div>
          <div className="rounded-[18px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.022))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            某些页面就算执行了书签，也会限制直接跨域请求；这种情况下会自动打开 Revive 中转页继续导入。
          </div>
          <button
            type="button"
            onClick={() => window.alert("请检查书签的网址是否以 javascript: 开头。如果不是，请使用“复制书签代码”手动新建书签。")}
            className={ghost}
          >
            查看使用提醒
          </button>
        </div>
      </aside>
    </div>
  );
}
