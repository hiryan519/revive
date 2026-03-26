"use client";

import { ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const formatter = useMemo(() => new Intl.NumberFormat("zh-CN"), []);

  const scopes = useMemo(
    () =>
      [
        { id: "all", name: "全部个人收藏", count: 1248 },
        { id: "product", name: "产品相关收藏", count: 320 },
        { id: "event", name: "发布会素材", count: 48 },
        { id: "pricing", name: "定价研究笔记", count: 76 },
      ] as const,
    [],
  );

  const examples = useMemo(
    () =>
      [
        {
          id: "salon",
          title: "整理技术沙龙执行框架",
          fill: "帮我整理一个技术沙龙执行框架，包含目标、流程、分工和时间线",
        },
        {
          id: "pricing",
          title: "分析竞品定价逻辑",
          fill: "帮我分析竞品定价逻辑，并整理一份可复用的定价对照框架",
        },
        {
          id: "event",
          title: "复用发布会方案结构",
          fill: "参考我过去收藏的发布会内容，帮我整理一个可复用的大纲结构",
        },
      ] as const,
    [],
  );

  const [scopeId, setScopeId] = useState<(typeof scopes)[number]["id"]>("all");
  const scope = useMemo(
    () => scopes.find((s) => s.id === scopeId) ?? scopes[0],
    [scopeId, scopes],
  );

  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isClosingScope, setIsClosingScope] = useState(false);
  const [justFilled, setJustFilled] = useState(false);

  const ready = text.trim().length > 0;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const closeScopeSheet = useCallback(() => {
    if (!isScopeOpen || isClosingScope) return;
    setIsClosingScope(true);
    window.setTimeout(() => {
      setIsScopeOpen(false);
      setIsClosingScope(false);
    }, 180);
  }, [isClosingScope, isScopeOpen]);

  useEffect(() => {
    if (!isScopeOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeScopeSheet();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeScopeSheet, isScopeOpen]);

  const buttonClassName = useMemo(() => {
    return ready
      ? [
          "bg-violet-600 text-white",
          "shadow-[0_10px_22px_rgba(124,58,237,0.22)]",
          "ring-1 ring-violet-600/10",
        ].join(" ")
      : ["bg-slate-200 text-slate-500", "ring-1 ring-slate-200"].join(" ");
  }, [ready]);

  const fillExample = (value: string) => {
    setText(value);
    closeScopeSheet();
    setJustFilled(true);
    window.setTimeout(() => setJustFilled(false), 650);

    window.requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        textareaRef.current?.focus();
        const len = textareaRef.current?.value.length ?? 0;
        textareaRef.current?.setSelectionRange(len, len);
      }, 240);
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-slate-900">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-8">
        <header className="px-1">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-xl bg-violet-600 shadow-[0_10px_20px_rgba(124,58,237,0.22)]">
              <div className="absolute right-[10px] top-[10px] h-2 w-2 rounded-full bg-white/90" />
            </div>
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">
              Revive
            </div>
          </div>

          <h1 className="mt-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900">
            基于历史收藏完成当前任务
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
            输入你的当前需求，Revive 会提炼出可直接复用的结果，并附引用依据
          </p>
        </header>

        <section className="mt-6">
          <div
            ref={cardRef}
            className={[
              "rounded-2xl bg-white",
              "ring-1 ring-slate-200/80",
              "shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3">
              <div className="min-w-0 text-[13px] text-slate-600">
                <span className="text-slate-500">检索范围：</span>
                <span className="font-medium text-slate-800">
                  {scope.name}
                </span>
                <span className="text-slate-400">
                  {" "}
                  （{formatter.format(scope.count)}）
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsScopeOpen(true)}
                className={[
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-[13px] font-medium",
                  "text-violet-700 hover:text-violet-800",
                  "hover:bg-violet-50 active:bg-violet-100",
                  "transition-colors",
                ].join(" ")}
              >
                更改
              </button>
            </div>

            <div className="px-4 py-4">
              <div
                className={[
                  "rounded-xl bg-slate-50",
                  "ring-1 ring-slate-200/70",
                  isFocused
                    ? "ring-violet-300/70 shadow-[0_0_0_4px_rgba(124,58,237,0.08)]"
                    : "shadow-none",
                  justFilled && !isFocused
                    ? "ring-violet-300/70 shadow-[0_0_0_4px_rgba(124,58,237,0.08)]"
                    : "",
                  "transition-shadow",
                ].join(" ")}
              >
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="帮我整理一个发布会沟通大纲"
                  className={[
                    "w-full resize-none bg-transparent px-3.5 py-3 text-[15px] leading-relaxed",
                    "text-slate-900 placeholder:text-slate-400 outline-none",
                    isFocused ? "min-h-[124px]" : "min-h-[92px]",
                    "transition-[min-height] duration-200",
                  ].join(" ")}
                  aria-label="任务输入框"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-[12px] text-slate-500">
                  将基于{" "}
                  <span className="font-medium text-slate-700">
                    {scope.name}
                  </span>{" "}
                  进行检索与提炼
                </div>
                <div className="text-[12px] text-slate-400">
                  {text.trim().length}/500
                </div>
              </div>

              <button
                type="button"
                disabled={!ready}
                aria-disabled={!ready}
                onClick={() => {
                  if (!ready) return;
                  window.alert("已发起复用任务（本地 mock）");
                }}
                className={[
                  "mt-4 inline-flex w-full items-center justify-center",
                  "rounded-xl px-4 py-2.5 text-[15px] font-semibold",
                  "transition-all duration-150",
                  ready
                    ? "active:translate-y-[0.5px] hover:brightness-[0.99]"
                    : "cursor-not-allowed",
                  buttonClassName,
                ].join(" ")}
              >
                发起复用任务
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 px-1">
          <div className="text-[13px] font-semibold text-slate-800">
            试试这样发起任务
          </div>
          <div className="mt-2 divide-y divide-slate-200/70 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/70">
            {examples.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => fillExample(ex.fill)}
                className={[
                  "group flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
                  "hover:bg-slate-50 active:bg-slate-100",
                  "transition-colors",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] text-slate-700">
                    {ex.title}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-slate-500" />
              </button>
            ))}
          </div>
        </section>
      </main>

      {isScopeOpen ? (
        <div
          className={[
            "fixed inset-0 z-50",
            isClosingScope ? "pointer-events-none" : "pointer-events-auto",
          ].join(" ")}
          aria-modal="true"
          role="dialog"
        >
          <button
            type="button"
            onClick={closeScopeSheet}
            className={[
              "absolute inset-0",
              "bg-slate-900/30 backdrop-blur-[2px]",
              "transition-opacity duration-200",
              isClosingScope ? "opacity-0" : "opacity-100",
            ].join(" ")}
            aria-label="关闭范围选择"
          />

          <div
            className={[
              "absolute inset-x-0 bottom-0",
              "rounded-t-2xl bg-white",
              "shadow-[0_-18px_48px_rgba(15,23,42,0.18)]",
              "ring-1 ring-slate-200/70",
              "transition-transform duration-200",
              isClosingScope ? "translate-y-4" : "translate-y-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-[14px] font-semibold text-slate-900">
                更改检索范围
              </div>
              <button
                type="button"
                onClick={closeScopeSheet}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                aria-label="关闭"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-2 pb-3">
              {scopes.map((s) => {
                const selected = s.id === scopeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setScopeId(s.id);
                      closeScopeSheet();
                    }}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left",
                      "hover:bg-slate-50 active:bg-slate-100 transition-colors",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-slate-800">
                        {s.name}
                        <span className="text-slate-400">
                          {" "}
                          （{formatter.format(s.count)}）
                        </span>
                      </div>
                    </div>

                    <div
                      className={[
                        "h-5 w-5 rounded-full ring-1",
                        selected
                          ? "bg-violet-600 ring-violet-600"
                          : "bg-white ring-slate-300",
                        "transition-colors",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div className="h-2" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
