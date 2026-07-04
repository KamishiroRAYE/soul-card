import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Note } from "@/components/Section";

export const metadata: Metadata = {
  title: "開発状況",
  description:
    "Soul Card Akashic α版の実装状況。現在遊べる機能と、これから追加・調整していく予定をまとめています。",
};

// 現在α版で遊べる実装済み機能
const DONE: { title: string; body: string }[] = [
  {
    title: "ソウルシステム",
    body: "ソウルユニットの覚醒・進化・専用のS効果まで一通り動作します。相棒を伏せて始め、条件を満たして目覚めさせる中核体験を遊べます。",
  },
  {
    title: "1人用：AI対戦",
    body: "コンピューター相手に、神征（1試合）を最後まで通してプレイできます。デッキを選んで神跡を巡る攻防を体験できます。",
  },
  {
    title: "チュートリアル",
    body: "誘導付きの初回マッチを搭載。勝利条件・フェイズの流れ・レコード設置・召喚・攻撃までを、実際に操作しながら学べます。",
  },
  {
    title: "デッキビルダー",
    body: "イラスト主体のグリッド表示でデッキを編集・保存。デッキの正当性チェック（枚数・同名上限・ソウルユニット必須）も働きます。",
  },
  {
    title: "対戦フローと効果",
    body: "全7フェーズの自動進行に対応。起動・誘発・永続・カウンター・効果無効化など、多彩なカード効果が処理されます。",
  },
  {
    title: "カード群（8属性 × 24系譜）",
    body: "ソウルユニット・系譜ネクサス・ユニット・魔法・アイテムを実装。内容はカードリストで順次公開しています。",
  },
  {
    title: "サウンド",
    body: "効果音を搭載し、神跡の高まりに連動してBGMが切り替わる仕組みが動作します。",
  },
  {
    title: "アプリの基本機能",
    body: "日本語UI、フルスクリーン⇔ウィンドウ切替、バージョン表記に対応。不具合報告時はこのバージョン表記をご確認ください。",
  },
];

// 開発中・今後の予定
const PLANNED: { title: string; body: string }[] = [
  {
    title: "対人戦",
    body: "オンライン／同一端末での対人対戦は開発予定です。現在の対戦はAI戦のみとなります。",
  },
  {
    title: "AIの強化",
    body: "現在のAIは基本的な行動が中心です。ネクサスや魔法の活用など、より手応えのある思考を目指して改善していきます。",
  },
  {
    title: "カードの拡充と調整",
    body: "カードの追加実装を続けています。一部カードの効果・数値・名称はバランス調整により変更される場合があります。",
  },
  {
    title: "BGMの拡充",
    body: "各場面のBGMを順次追加していきます。",
  },
  {
    title: "バグ報告ページ",
    body: "不具合を報告いただける窓口ページを準備中です。",
  },
];

export default function StatusPage() {
  return (
    <>
      <PageHeader
        eyebrow="DEVELOPMENT STATUS"
        title="開発状況"
        lead="「Soul Card Akashic」は個人開発中のα版です。現在遊べる機能と、これから追加・調整していく内容をまとめています。"
      />

      <Section title="現在遊べること（実装済み）">
        <div className="grid gap-4 md:grid-cols-2">
          {DONE.map((f) => (
            <div
              key={f.title}
              className="tile flex gap-4 rounded-lg border border-border bg-surface p-5"
            >
              <span
                className="mt-0.5 shrink-0 font-serif text-lg font-bold text-gold-bright"
                aria-hidden
              >
                ✓
              </span>
              <div>
                <h3 className="font-serif font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="開発中・今後の予定">
        <div className="grid gap-4 md:grid-cols-2">
          {PLANNED.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-dashed border-border bg-surface/50 p-5"
            >
              <h3 className="font-serif font-bold text-gold">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Note>
            α版のため、仕様・数値・カード内容は今後予告なく変更されることがあります。
            最新の実装済みカードは{" "}
            <Link
              href="/cards"
              className="text-gold transition-colors hover:text-gold-bright"
            >
              カードリスト
            </Link>
            を、ダウンロードは{" "}
            <Link
              href="/download"
              className="text-gold transition-colors hover:text-gold-bright"
            >
              ダウンロードページ
            </Link>
            をご覧ください。
          </Note>
        </div>

        <p className="mt-6 text-xs tracking-widest text-muted">
          最終更新：2026年7月
        </p>
      </Section>
    </>
  );
}
