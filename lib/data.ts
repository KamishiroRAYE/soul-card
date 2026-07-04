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
  en: string; // Unity の Lineage enum 値（カードデータの系譜キー）
  enLabel?: string; // 表示用の外国語名（en と異なる場合のみ。例：巨人＝Titan）
};

// 24系譜（Unity の Lineage enum 準拠）
export const LINEAGES: Lineage[] = [
  { name: "守護", en: "Guardian" },
  { name: "魔導", en: "Magi" },
  { name: "獣", en: "Beast" },
  { name: "飛翼", en: "Avian" },
  { name: "竜", en: "Dragon" },
  { name: "妖精", en: "Fairy" },
  { name: "精霊", en: "Spirit" },
  { name: "不死", en: "Undead" },
  { name: "悪魔", en: "Demon" },
  { name: "天使", en: "Angel" },
  { name: "機械", en: "Mechanic" },
  { name: "真人", en: "Human" },
  { name: "救世", en: "Savior" },
  { name: "原初", en: "Primordial" },
  { name: "神秘", en: "Mystic" },
  { name: "記憶", en: "Memory" },
  { name: "深淵", en: "Abyss" },
  { name: "混沌", en: "Chaos" },
  { name: "天空", en: "Sky" },
  { name: "大地", en: "GrandEarth" },
  { name: "海洋", en: "Ocean" },
  { name: "冥府", en: "Underworld" },
  { name: "雷電", en: "Raiden" },
  { name: "巨人", en: "Giant", enLabel: "Titan" },
];

export type Phase = {
  name: string;
  en: string;
  desc: string;
};

export const PHASES: Phase[] = [
  { name: "ドローフェイズ", en: "Draw", desc: "デッキから1枚引く（先攻ターン1はスキップ）。デッキ切れ時は引けなかった枚数ぶん瑕疵を負う。" },
  { name: "レコードフェイズ", en: "Record", desc: "手札から1枚を相手に公開してレコードに置ける（任意・1ターン1枚）。レコード枚数がコスト上限（最大12）になる。" },
  { name: "ソウルフェイズ", en: "Soul", desc: "1ターンに1度、ソウルユニットの覚醒・再覚醒ができる。成功すると神跡+1。" },
  { name: "アクティブフェイズ", en: "Active", desc: "自分のインアクティブ状態（横向き）のカードをすべてアクティブに戻す。" },
  { name: "メインフェイズ", en: "Main", desc: "レコードのコストを払ってカードをプレイ。相手も魔法を割り込みで使用できる。" },
  { name: "バトルフェイズ", en: "Battle", desc: "ユニットで相手を攻撃する（任意・スキップ可能）。" },
  { name: "エンドフェイズ", en: "End", desc: "エンド時効果を処理し、相手に手番を渡す。" },
];

// 勝敗・準備（公式設定資料 v1.0+v1.1 準拠）
export const VICTORY = {
  initial: 6,
  win: 12,
  lose: 0,
  initialHand: 5,
  deckMin: 40,
  sameCardMax: 3,
};

// ソウル効果の実例（救世神器 レイ）
export const SOUL_EXAMPLE = {
  name: "救世神器　レイ",
  attribute: "無",
  lineage: "救世",
  meta: "Lv1 / HP1000 / ATK0 / バースト1",
  awaken: "自分フィールドに系譜が5種類以上存在する（ノーコスト）",
  effects: [
    { tag: "【永続：S】", text: "自分はネクサスのエンゲージ上限を無視できる。" },
    {
      tag: "【永続】",
      text: "自分のフィールド・墓地のネクサス1枚につき、このカードは+1000/+1000。",
    },
  ],
};

export type Term = { term: string; read?: string; desc: string };

// 用語集（公式設定資料より抜粋）
export const GLOSSARY: Term[] = [
  { term: "ディメンションリンク", desc: "ゲーム開始の合図。両プレイヤーが次元世界と接続する儀式。" },
  { term: "神征", read: "しんせい", desc: "1試合の単位。「この神征に1度」という形で使う。" },
  { term: "神跡", read: "しんせき", desc: "神に成るための資格。0で即時敗北、12で即時勝利。" },
  { term: "神座", read: "かむくら", desc: "至高の座。神跡を極めた魂が到達する場所。" },
  { term: "瑕疵", read: "かし", desc: "ダメージを受けること自体の汚点。1瑕疵＝神跡−1。" },
  { term: "レコード", desc: "手札から公開して置かれたカード。コストの供給源（最大12枚）。" },
  { term: "ソウルユニット", desc: "魂の本質。HP0以下や強制除去でも最大HP全回復して場に残り、プレイヤーが瑕疵1を負う。" },
  { term: "エンゲージ", desc: "ネクサスをフィールドに設置する行為。" },
  { term: "接続", desc: "ネクサスが場に出た際の発動タイミング（「接続時」）。" },
  { term: "バースト", desc: "1度の攻撃でダメージを与える回数。" },
  { term: "アクションステップ", desc: "バトル解決の前後に設けられる、魔法を使えるタイミング。" },
  { term: "系譜", desc: "ユニットの種族。効果・進化条件・ネクサス効果の参照に用いる。" },
];

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
  { tag: "【誘発】", desc: "条件が成立したときに使える効果（任意か強制かはカードのテキストによる）。【召喚時】【破壊時】などはこの一種。" },
  { tag: "【永続】", desc: "場にある間、ずっと適用され続ける効果。" },
  { tag: "【カウンター】", desc: "相手の行動に割り込んで発動する効果。" },
];

export const SOUL_EFFECT_LABELS = ["【起動：S】", "【誘発：S】", "【永続：S】", "【カウンター：S】"];
