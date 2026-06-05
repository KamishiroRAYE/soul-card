// ゲームの基礎データ。Unity の CardData enum と対応。
// 将来カードDBページを作るときもここを参照する。

export type Attribute = {
  key: string;
  name: string;
  en: string;
  color: string; // テーマ色（バッジ用）
  desc: string;
};

export const ATTRIBUTES: Attribute[] = [
  { key: "earth", name: "地", en: "Earth", color: "#8a6d3b", desc: "堅牢と継続。守りと蓄積の力。" },
  { key: "water", name: "水", en: "Water", color: "#3b7fa8", desc: "流転と適応。回復と循環の力。" },
  { key: "fire", name: "火", en: "Fire", color: "#b04a3a", desc: "破壊と激情。攻撃と速度の力。" },
  { key: "wind", name: "風", en: "Wind", color: "#5a9e7a", desc: "自由と機動。展開と回避の力。" },
  { key: "light", name: "光", en: "Light", color: "#d6c878", desc: "秩序と祝福。強化と浄化の力。" },
  { key: "dark", name: "闇", en: "Dark", color: "#6b4a8a", desc: "侵食と謀略。妨害と代償の力。" },
  { key: "neutral", name: "無", en: "Neutral", color: "#8a8a8a", desc: "中立。属性に縛られぬ汎用の力。" },
  { key: "god", name: "神", en: "God", color: "#c9a85c", desc: "超越。世界の理に触れる至高の力。" },
];

export type Lineage = {
  name: string;
  en: string;
};

// 22系譜（Unity の Lineage enum 準拠）
export const LINEAGES: Lineage[] = [
  { name: "騎士", en: "Knight" },
  { name: "魔導", en: "Magi" },
  { name: "獣", en: "Beast" },
  { name: "竜", en: "Dragon" },
  { name: "妖精", en: "Fairy" },
  { name: "精霊", en: "Spirit" },
  { name: "不死", en: "Undead" },
  { name: "悪魔", en: "Demon" },
  { name: "天使", en: "Angel" },
  { name: "機巧", en: "Mechanic" },
  { name: "人間", en: "Human" },
  { name: "救世主", en: "Savior" },
  { name: "原初", en: "Primordial" },
  { name: "神秘", en: "Mystic" },
  { name: "記憶", en: "Memory" },
  { name: "深淵", en: "Abyss" },
  { name: "混沌", en: "Chaos" },
  { name: "天空", en: "Sky" },
  { name: "大地", en: "GrandEarth" },
  { name: "海洋", en: "Ocean" },
  { name: "冥界", en: "Underworld" },
  { name: "雷電", en: "Raiden" },
];

export type Phase = {
  name: string;
  en: string;
  desc: string;
};

export const PHASES: Phase[] = [
  { name: "ドローフェーズ", en: "Draw", desc: "デッキからカードを1枚引く。ターンの始まり。（先攻1ターン目はスキップ）" },
  { name: "レコードフェーズ", en: "Record", desc: "このターンに使うリソースを整え、盤面の準備を行う。" },
  { name: "ソウルフェーズ", en: "Soul", desc: "ソウルユニットの覚醒など、魂に関わる処理を行う独自の段階。" },
  { name: "アクティブフェーズ", en: "Active", desc: "場の全カードをアクティブ（行動可能）状態に戻す。" },
  { name: "メインフェーズ", en: "Main", desc: "ユニットの召喚、魔法・アイテムの使用、ネクサスの設置などを行う。" },
  { name: "バトルフェーズ", en: "Battle", desc: "ユニットで相手を攻撃する。" },
  { name: "エンドフェーズ", en: "End", desc: "ターンを終了し、相手に手番を渡す。" },
];

// 勝敗（GameManager.cs の定数準拠）
export const VICTORY = {
  initial: 6,
  win: 12,
  lose: 0,
  initialHand: 5,
};

// ソウル効果の実例（救世神器 レイ）
export const SOUL_EXAMPLE = {
  name: "救世神器　レイ",
  attribute: "無",
  awaken: "自分フィールドに異なる系譜が5つ以上存在する",
  effects: [
    { tag: "【永続：S】", text: "自分は接続できるネクサスの上限を無視する。" },
    {
      tag: "【永続】",
      text: "自分フィールド・墓地に存在するネクサス1枚につき、このカードは+1000/+1000。",
    },
  ],
};

export type CardKind = {
  name: string;
  desc: string;
  subtypes?: string[];
};

export const CARD_KINDS: CardKind[] = [
  {
    name: "ユニット",
    desc: "盤面に出して戦う主役。レベル・コスト・HP・攻撃力を持ち、一部は進化する。",
  },
  {
    name: "魔法",
    desc: "様々な効果を発動するカード。",
    subtypes: ["通常魔法", "永続魔法", "付与魔法"],
  },
  {
    name: "アイテム",
    desc: "ユニットを支援・強化するカード。",
    subtypes: ["通常アイテム", "永続アイテム", "装備アイテム"],
  },
  {
    name: "ネクサス",
    desc: "場に置いて継続的に作用する、盤面の基盤となるカード。",
  },
];

export const EFFECT_LABELS = [
  { tag: "【起動】", desc: "自分のタイミングで能動的に発動する効果。" },
  { tag: "【召喚時】", desc: "ユニットが場に出たときに発動する効果。" },
  { tag: "【永続】", desc: "場にある間、ずっと適用され続ける効果。" },
  { tag: "【カウンター】", desc: "相手の行動に割り込んで発動する効果。" },
];

export const SOUL_EFFECT_LABELS = ["【起動：S】", "【誘発：S】", "【永続：S】", "【カウンター：S】"];
