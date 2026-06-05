import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/Section";
import {
  PHASES,
  CARD_KINDS,
  EFFECT_LABELS,
  SOUL_EFFECT_LABELS,
  VICTORY,
  SOUL_EXAMPLE,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "遊び方",
  description: "Soul Record - Soul Card の基本ルール。ターンの流れ、カードの種類、ソウルシステムを解説。",
};

export default function RulesPage() {
  return (
    <>
      <PageHeader
        eyebrow="HOW TO PLAY"
        title="遊び方"
        lead="基本ルールはシンプル。1対1でデッキを操り、相手の神跡を巡って戦います。"
      />

      {/* 勝利条件 / 準備 */}
      <Section title="ゲームの目的と準備">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-gold-bright">
              勝利条件 ― 神跡（しんせき）
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              両プレイヤーは「神跡」を{" "}
              <strong className="text-foreground">{VICTORY.initial}</strong>{" "}
              から始めます。攻防を通じて神跡を動かし合い、
            </p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
              <li>
                自分の神跡を{" "}
                <strong className="text-gold-bright">{VICTORY.win} まで高める</strong>
                と勝利（＝神座への到達）。
              </li>
              <li>
                神跡が{" "}
                <strong className="text-gold-bright">{VICTORY.lose} になる</strong>
                と敗北。
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              ライフを削り切る方式ではなく、0〜{VICTORY.win} の綱引きで勝敗が決まります。
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-gold-bright">
              ゲームの準備
            </h3>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
              <li>デッキを用意する</li>
              <li>ソウルユニットを1枚選び、裏向きでソウルゾーンに置く</li>
              <li>
                手札を{" "}
                <strong className="text-foreground">{VICTORY.initialHand}</strong>{" "}
                枚引いてゲーム開始（先攻の1ターン目はドローを行わない）
              </li>
            </ol>
          </div>
        </div>
      </Section>

      {/* ターンの流れ */}
      <Section title="ターンの流れ">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted">
          1ターンは7つのフェーズで進みます。
        </p>
        <ol className="space-y-3">
          {PHASES.map((p, i) => (
            <li
              key={p.en}
              className="tile flex items-start gap-4 rounded-lg border border-border bg-surface p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold font-serif text-sm font-bold text-gold-bright">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-foreground">
                  {p.name}{" "}
                  <span className="ml-1 text-xs tracking-widest text-muted">
                    {p.en} Phase
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* カードの種類 */}
      <Section title="カードの種類">
        <div className="grid gap-4 md:grid-cols-2">
          {CARD_KINDS.map((k) => (
            <div
              key={k.name}
              className="tile rounded-lg border border-border bg-surface p-6"
            >
              <h3 className="mb-2 font-serif text-lg font-bold text-gold-bright">
                {k.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{k.desc}</p>
              {k.subtypes && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {k.subtypes.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 効果ラベル */}
      <Section title="効果の読み方">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted">
          カードの効果は、発動の仕方によってラベルが付きます。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EFFECT_LABELS.map((e) => (
            <div
              key={e.tag}
              className="flex items-start gap-3 rounded-md border border-border bg-surface p-4"
            >
              <span className="shrink-0 rounded bg-surface-2 px-2 py-1 font-serif text-sm font-bold text-gold-bright">
                {e.tag}
              </span>
              <p className="text-sm leading-relaxed text-muted">{e.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ソウルシステム */}
      <Section title="ソウルシステム ― このゲームの心臓部">
        <div className="rounded-lg border border-gold/40 bg-gradient-to-b from-surface to-surface-2 p-7">
          <p className="leading-relaxed text-foreground/90">
            デッキを組むとき、あなたは1枚だけ
            <strong className="text-gold-bright">「ソウルユニット」</strong>
            を選びます。これはいわば相棒。ゲーム開始時から
            <strong className="text-gold-bright">裏向きで</strong>
            盤面のソウルゾーンに置かれています。
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            裏向きのソウルユニットは、各カードに定められた
            <strong className="text-gold-bright">「覚醒」</strong>
            によって表向きになります。覚醒には固有の
            <strong className="text-foreground">覚醒条件</strong>を満たすか、
            <strong className="text-foreground">覚醒コスト</strong>を支払う必要があります。
            覚醒したソウルユニットは、本来の力と専用の S 効果を解き放ちます。
          </p>
          <div className="mt-6">
            <p className="mb-3 text-sm font-bold tracking-widest text-gold">
              S（ソウル）効果
            </p>
            <div className="flex flex-wrap gap-2">
              {SOUL_EFFECT_LABELS.map((s) => (
                <span
                  key={s}
                  className="rounded border border-gold/40 bg-surface-2 px-3 py-1.5 font-serif text-sm font-bold text-gold-bright"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              ソウルユニットは、通常の効果に加えてこれら専用の S 効果を持つことがあります。
              何をソウルに選ぶかで、デッキの戦い方が大きく変わります。
            </p>
          </div>

          {/* 実例カード */}
          <div className="mt-8 rounded-lg border border-border bg-background/40 p-5">
            <p className="mb-1 text-xs tracking-widest text-gold">EXAMPLE</p>
            <p className="font-serif text-lg font-bold text-foreground">
              {SOUL_EXAMPLE.name}
              <span className="ml-2 align-middle text-xs text-muted">
                ソウルユニット / {SOUL_EXAMPLE.attribute}属性
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              <span className="font-bold text-gold-bright">【覚醒】</span>
              {SOUL_EXAMPLE.awaken}
            </p>
            {SOUL_EXAMPLE.effects.map((e) => (
              <p key={e.tag} className="mt-1.5 text-sm leading-relaxed text-muted">
                <span className="font-bold text-gold-bright">{e.tag}</span>
                {e.text}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
