"use client";

import { useMemo, useState } from "react";
import {
  CARDS,
  getSortedCards,
  attrName,
  attrColor,
  lineageName,
  KIND_LABEL,
  SUBTYPE_LABEL,
  type GameCard,
  type CardKindKey,
} from "@/lib/cards";
import { ATTRIBUTES, LINEAGES } from "@/lib/data";

type KindFilter = "all" | CardKindKey;
type AttrFilter = "all" | string;
type LineageFilter = "all" | string;

const KIND_FILTERS: { key: KindFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "Unit", label: "ユニット" },
  { key: "EvolutionUnit", label: "進化" },
  { key: "Magic", label: "魔法" },
  { key: "Item", label: "アイテム" },
  { key: "Nexus", label: "ネクサス" },
];

// 実際にカードで使われている系譜のみ表示（LINEAGES の順序を維持）
const LINEAGE_FILTERS = LINEAGES.filter((l) =>
  CARDS.some((c) => c.lineages.includes(l.en))
);

export default function CardsBrowser() {
  const [kind, setKind] = useState<KindFilter>("all");
  const [attr, setAttr] = useState<AttrFilter>("all");
  const [lineage, setLineage] = useState<LineageFilter>("all");

  const cards = useMemo(() => {
    const filtered = CARDS.filter(
      (c) =>
        (kind === "all" || c.kind === kind) &&
        (attr === "all" || c.attribute === attr) &&
        (lineage === "all" || c.lineages.includes(lineage))
    );
    return getSortedCards(filtered);
  }, [kind, attr, lineage]);

  return (
    <div>
      {/* フィルタ */}
      <div className="mb-8 space-y-4">
        <FilterRow label="種類">
          {KIND_FILTERS.map((f) => (
            <Chip
              key={f.key}
              active={kind === f.key}
              onClick={() => setKind(f.key)}
            >
              {f.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="属性">
          <Chip active={attr === "all"} onClick={() => setAttr("all")}>
            すべて
          </Chip>
          {ATTRIBUTES.map((a) => (
            <Chip
              key={a.en}
              active={attr === a.en}
              onClick={() => setAttr(a.en)}
              dot={a.color}
            >
              {a.name}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="系譜">
          <Chip active={lineage === "all"} onClick={() => setLineage("all")}>
            すべて
          </Chip>
          {LINEAGE_FILTERS.map((l) => (
            <Chip
              key={l.en}
              active={lineage === l.en}
              onClick={() => setLineage(l.en)}
            >
              {l.name}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mb-5 text-xs tracking-widest text-muted">
        {cards.length} 枚（コスト→名前順）
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <CardTile key={c.id} card={c} />
        ))}
      </div>

      {cards.length === 0 && (
        <p className="py-16 text-center text-muted">
          条件に合うカードがありません。
        </p>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-10 shrink-0 text-xs tracking-widest text-gold">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-gold bg-surface-2 text-gold-bright"
          : "border-border text-muted hover:text-foreground"
      }`}
    >
      {dot && (
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: dot }}
        />
      )}
      {children}
    </button>
  );
}

function CardTile({ card }: { card: GameCard }) {
  const isUnit = card.kind === "Unit" || card.kind === "EvolutionUnit";
  const hasLineages = card.lineages.length > 0;
  const subTypeLabel = card.subType ? SUBTYPE_LABEL[card.subType] : undefined;
  return (
    <article className="tile flex flex-col rounded-lg border border-border bg-surface p-5">
      {/* ヘッダー */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold text-background"
          style={{ background: attrColor(card.attribute) }}
          title={`${attrName(card.attribute)}属性`}
        >
          {card.cost}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif font-bold leading-snug text-foreground">
            {card.name}
            {card.soul && (
              <span className="ml-2 align-middle text-[0.65rem] tracking-widest text-gold-bright">
                SOUL
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {subTypeLabel ?? KIND_LABEL[card.kind]}・{attrName(card.attribute)}属性・コスト
            {card.cost}
            {hasLineages && (
              <span className="ml-2 text-foreground/70">
                {card.lineages.map((l) => lineageName(l)).join(" / ")}系譜
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ステータス（ユニット） */}
      {isUnit && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="HP" value={card.hp ?? 0} />
          <Stat label="ATK" value={card.atk ?? 0} />
          <Stat label="バースト" value={card.burst ?? 1} />
        </div>
      )}

      {/* 効果 */}
      {card.effects && card.effects.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          {card.effects.map((e, i) => (
            <p
              key={i}
              className="whitespace-pre-line text-sm leading-relaxed text-muted"
            >
              {e.label && (
                <span className="font-bold text-gold-bright">{e.label}</span>
              )}
              {e.text}
            </p>
          ))}
        </div>
      )}

      {isUnit && (!card.effects || card.effects.length === 0) && (
        <p className="mt-3 text-xs text-muted/70">効果を持たないバニラユニット。</p>
      )}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-surface-2/40 py-2">
      <p className="text-[0.6rem] tracking-widest text-muted">{label}</p>
      <p className="font-serif text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
