import Link from "next/link";
import { SITE } from "@/lib/nav";
import { ATTRIBUTES, LINEAGES } from "@/lib/data";

const FEATURES = [
  {
    title: "ソウルユニット",
    body: "デッキの相棒を1枚だけ選び、裏向きで盤面に置いてスタート。条件を満たすと目覚め、専用の「S効果」を解き放つ、このゲーム最大の独自要素。",
  },
  {
    title: "神跡（しんせき）",
    body: "ライフポイントの代わりとなる六角形のノード。攻防の駆け引きが、そのまま世界の理＝神跡を巡る戦いになる。",
  },
  {
    title: "25系譜 × 8属性",
    body: "騎士・竜・天使・深淵・混沌……。広大な系譜と属性の組み合わせが、無数のデッキと物語を生み出す。",
  },
];

export default function Home() {
  return (
    <>
      {/* ヒーロー */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-28 text-center md:py-40">
          <p className="mb-5 text-xs tracking-[0.4em] text-gold">
            ORIGINAL TRADING CARD GAME
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-wide text-gold-bright md:text-7xl">
            {SITE.title}
          </h1>
          <p className="mt-4 text-sm tracking-[0.3em] text-muted md:text-base">
            {SITE.titleJa}
          </p>
          <p className="mx-auto mt-8 max-w-xl text-muted leading-relaxed">
            {SITE.tagline}。<br />
            魂を懸けて世界の記録（レコード）を奪い合う、デジタルカードバトル。
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/world"
              className="rounded-full bg-gold px-8 py-3 text-sm font-bold tracking-widest text-background transition-colors hover:bg-gold-bright"
            >
              世界観を知る
            </Link>
            <Link
              href="/rules"
              className="rounded-full border border-border px-8 py-3 text-sm tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold-bright"
            >
              遊び方を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="tile rounded-lg border border-border bg-surface p-7"
            >
              <h2 className="mb-3 font-serif text-xl font-bold text-gold-bright">
                {f.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 属性 */}
      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="heading-rule mb-8 font-serif text-2xl font-bold tracking-wide text-gold-bright">
            8つの属性
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ATTRIBUTES.map((a) => (
              <div
                key={a.key}
                className="tile flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold text-background"
                  style={{ background: a.color }}
                >
                  {a.name}
                </span>
                <span className="text-xs tracking-widest text-muted">{a.en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 系譜 */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="heading-rule mb-8 font-serif text-2xl font-bold tracking-wide text-gold-bright">
          25の系譜
        </h2>
        <div className="flex flex-wrap gap-2">
          {LINEAGES.map((l) => (
            <span
              key={l.en}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-gold hover:text-gold-bright"
            >
              {l.name}
            </span>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/world"
            className="text-sm tracking-widest text-gold transition-colors hover:text-gold-bright"
          >
            → それぞれの系譜と世界の物語へ
          </Link>
        </p>
      </section>
    </>
  );
}
