"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ART } from "@/lib/art";

type KindFilter = "all" | CardKindKey;
type AttrFilter = "all" | string;
type LineageFilter = "all" | string;
type ViewMode = "image" | "text";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const artSrc = (name: string): string | null =>
  ART[name] ? `${BASE}/cards/${ART[name]}` : null;

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

type ZoomTarget = { src: string; name: string };

export default function CardsBrowser() {
  const [kind, setKind] = useState<KindFilter>("all");
  const [attr, setAttr] = useState<AttrFilter>("all");
  const [lineage, setLineage] = useState<LineageFilter>("all");
  const [view, setView] = useState<ViewMode>("image");
  const [zoom, setZoom] = useState<ZoomTarget | null>(null);

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
      {/* 表示モード切替（画像／テキスト） */}
      <div className="mb-6 flex overflow-hidden rounded-lg border border-border">
        <ViewTab active={view === "image"} onClick={() => setView("image")}>
          画像表示
        </ViewTab>
        <ViewTab active={view === "text"} onClick={() => setView("text")}>
          テキスト表示
        </ViewTab>
      </div>

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
          <CardTile
            key={c.id}
            card={c}
            showImage={view === "image"}
            onZoom={setZoom}
          />
        ))}
      </div>

      {cards.length === 0 && (
        <p className="py-16 text-center text-muted">
          条件に合うカードがありません。
        </p>
      )}

      {zoom && <Lightbox target={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 text-sm font-bold tracking-widest transition-colors ${
        active
          ? "bg-surface-2 text-gold-bright"
          : "bg-surface text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
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

function CardTile({
  card,
  showImage,
  onZoom,
}: {
  card: GameCard;
  showImage: boolean;
  onZoom: (t: ZoomTarget) => void;
}) {
  const isUnit = card.kind === "Unit" || card.kind === "EvolutionUnit";
  const hasLineages = card.lineages.length > 0;
  const subTypeLabel = card.subType ? SUBTYPE_LABEL[card.subType] : undefined;
  const src = artSrc(card.name);
  return (
    <article className="tile flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      {/* イラスト（画像表示モード） */}
      {showImage &&
        (src ? (
          <button
            type="button"
            onClick={() => onZoom({ src, name: card.name })}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-background"
            title="クリックで拡大"
            aria-label={`${card.name} のイラストを拡大`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${card.name} のイラスト`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute right-2 top-2 rounded bg-background/70 px-1.5 py-0.5 text-[0.6rem] tracking-widest text-gold-bright opacity-0 transition-opacity group-hover:opacity-100">
              拡大
            </span>
          </button>
        ) : (
          <div
            className="flex aspect-[4/3] w-full items-center justify-center bg-surface-2/40"
            style={{
              backgroundImage: `linear-gradient(135deg, ${attrColor(
                card.attribute
              )}22, transparent)`,
            }}
          >
            <span className="text-xs tracking-widest text-muted/60">
              イラスト準備中
            </span>
          </div>
        ))}

      <div className="flex flex-1 flex-col p-5">
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
              {subTypeLabel ?? KIND_LABEL[card.kind]}・{attrName(card.attribute)}
              属性・コスト
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
            <Stat label="攻撃力" value={card.atk ?? 0} />
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
          <p className="mt-3 text-xs text-muted/70">
            効果を持たないバニラユニット。
          </p>
        )}
      </div>
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

function Lightbox({
  target,
  onClose,
}: {
  target: ZoomTarget;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${target.name} のイラスト`}
    >
      <div
        className="flex max-h-full max-w-3xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={target.src}
          alt={`${target.name} のイラスト`}
          className="max-h-[80vh] w-auto rounded-lg border border-border object-contain shadow-2xl"
        />
        <p className="mt-3 font-serif tracking-widest text-gold-bright">
          {target.name}
        </p>
        <button
          onClick={onClose}
          className="mt-1 text-xs tracking-widest text-muted hover:text-foreground"
        >
          閉じる（クリック / Esc）
        </button>
      </div>
    </div>
  );
}
