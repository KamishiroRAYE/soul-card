// カードデータ。Unity の Assets/Cards/*.json（souls / nexus / vanilla）と対応。
// 表示順は cost → name（getSortedCards 参照）。effects のラベルはゲーム内の
// GetEffectLabel と同基準（接続時/永続/覚醒/進化/永続:S/誘発:S、ルール効果はラベル無し）。

import { ATTRIBUTES, LINEAGES } from "./data";

export type CardKindKey = "Unit" | "EvolutionUnit" | "Nexus" | "Magic" | "Item";

export type CardEffectLine = {
  label?: string; // 例：【接続時】【永続】。ルール効果は label 無し
  text: string;
};

export type GameCard = {
  id: string;
  name: string;
  cost: number;
  attribute: string; // ATTRIBUTES の en（Earth/Water/.../God）
  kind: CardKindKey;
  lineages: string[]; // LINEAGES の en。魔法・アイテムは空配列
  subType?: string; // 魔法・アイテムの種別（NormalMagic/PersistentMagic/NormalItem）
  hp?: number;
  atk?: number;
  burst?: number;
  soul?: boolean; // ソウルユニット
  evolution?: boolean; // 進化ユニット
  effects?: CardEffectLine[];
};

// ── ルックアップ ──
const ATTR_BY_EN = new Map(ATTRIBUTES.map((a) => [a.en, a]));
const LINEAGE_BY_EN = new Map(LINEAGES.map((l) => [l.en, l.name]));

export const attrName = (en: string) => ATTR_BY_EN.get(en)?.name ?? en;
export const attrColor = (en: string) => ATTR_BY_EN.get(en)?.color ?? "#8a8a8a";
export const lineageName = (en: string) => LINEAGE_BY_EN.get(en) ?? en;

export const KIND_LABEL: Record<CardKindKey, string> = {
  Unit: "ユニット",
  EvolutionUnit: "進化ユニット",
  Nexus: "ネクサス",
  Magic: "魔法",
  Item: "アイテム",
};

// 魔法・アイテムの種別ラベル
export const SUBTYPE_LABEL: Record<string, string> = {
  NormalMagic: "通常魔法",
  PersistentMagic: "永続魔法",
  NormalItem: "通常アイテム",
};

// 神征1度ルール（全ネクサス共通の効果外テキスト）
const NEXUS_ONCE = "このカード名の【接続時】効果は、神征中に１度しか発動できない。";

// 系譜ネクサスを定義から生成（接続時サーチ＋永続オーラ）
function nexus(
  name: string,
  attribute: string,
  lineageEn: string,
  lineageJa: string,
  aura: string,
  opts: { mill?: boolean; extraRule?: string } = {}
): GameCard {
  const verb = opts.mill ? "墓地へ送る" : "手札に加える";
  const search = `デッキの上から5枚を確認し、「${lineageJa}」の系譜を持つカード1枚を${verb}。残ったカードは好きな順番で、デッキの下に戻す。`;
  const effects: CardEffectLine[] = [];
  if (opts.extraRule) effects.push({ text: opts.extraRule });
  effects.push({ text: NEXUS_ONCE });
  effects.push({ label: "【接続時】", text: search });
  effects.push({ label: "【永続】", text: aura });
  return {
    id: `nexus-${lineageEn.toLowerCase()}`,
    name,
    cost: 3,
    attribute,
    kind: "Nexus",
    lineages: [lineageEn],
    effects,
  };
}

function vanilla(
  id: string,
  name: string,
  cost: number,
  attribute: string,
  hp: number,
  atk: number,
  lineageEn: string
): GameCard {
  return {
    id,
    name,
    cost,
    attribute,
    kind: "Unit",
    lineages: [lineageEn],
    hp,
    atk,
    burst: 1,
  };
}

// 効果や複数系譜・バースト指定を持つユニット
function unit(
  id: string,
  name: string,
  cost: number,
  attribute: string,
  hp: number,
  atk: number,
  lineages: string[],
  opts: { burst?: number; effects?: CardEffectLine[] } = {}
): GameCard {
  return {
    id,
    name,
    cost,
    attribute,
    kind: "Unit",
    lineages,
    hp,
    atk,
    burst: opts.burst ?? 1,
    effects: opts.effects,
  };
}

// 魔法・アイテム（HP/ATK・系譜を持たない）
function spell(
  id: string,
  name: string,
  cost: number,
  attribute: string,
  kind: "Magic" | "Item",
  subType: string,
  effects: CardEffectLine[]
): GameCard {
  return { id, name, cost, attribute, kind, lineages: [], subType, effects };
}

export const CARDS: GameCard[] = [
  // ── ソウル / 進化（救世神器 レイ） ──
  {
    id: "raye",
    name: "救世神器　レイ",
    cost: 1,
    attribute: "Neutral",
    kind: "Unit",
    lineages: ["Savior"],
    hp: 1000,
    atk: 0,
    burst: 1,
    soul: true,
    effects: [
      { label: "【覚醒】", text: "自分フィールドに異なる系譜が5つ以上存在する。" },
      { label: "【永続：S】", text: "自分は接続できるネクサスの上限を無視する。" },
      {
        label: "【永続】",
        text: "自分フィールド・墓地に存在するネクサス１枚につき、このカードは+1000/+1000。",
      },
    ],
  },
  {
    id: "raye-omega",
    name: "救世神器　レイ＝オメガ",
    cost: 13,
    attribute: "God",
    kind: "EvolutionUnit",
    lineages: ["Savior"],
    hp: 12000,
    atk: 12000,
    burst: 1,
    evolution: true,
    effects: [
      { label: "【進化】", text: "最大HP+ATKが25000以上のSユニット1体。" },
      {
        text: "自分フィールド・墓地のネクサス1枚につき、このカードの進化コスト−1。",
      },
      {
        text: "このカードの進化は無効化されず、このカードの進化時、相手は効果を使用・及び適用できない。",
      },
      {
        label: "【誘発：S】",
        text:
          "この神征中、以下の効果全てを適用する。この効果は無効化されない。\n" +
          "●自分・相手の各フェイズ開始・終了時、自分フィールド・墓地・レコードゾーンのネクサスカード1枚をこのカードの進化素材にできる。\n" +
          "●このカードが12枚以上のネクサスカードを進化素材に持つ場合、自分の神跡は12になる。",
      },
    ],
  },

  // ── 系譜ネクサス13種 ──
  nexus(
    "マギ・ネクサス",
    "Neutral",
    "Magi",
    "魔導",
    "自分フィールドの「魔導」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分の「魔導」の系譜を持つユニットのATK+1000。\n●5体以上：自分が使用する魔法のコスト-1。\n●7体以上：自分の「魔導」の系譜を持つユニットのバースト+1。\n●11体以上：自分の「魔導」の系譜を持つユニットは効果ダメージを受けない。"
  ),
  nexus(
    "エンジェル・ネクサス",
    "Light",
    "Angel",
    "天使",
    "自分フィールドの「天使」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分の「天使」の系譜を持つユニットのHP+1000。\n●5体以上：自分のドローフェイズの通常ドロー枚数+1。\n●7体以上：自分のターン開始時に神跡を1つ得る。\n●11体以上：自分への瑕疵を無効にする。"
  ),
  nexus(
    "デビル・ネクサス",
    "Neutral",
    "Demon",
    "悪魔",
    "自分フィールドの「悪魔」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分の「悪魔」の系譜を持つユニットのATK+1000。\n●5体以上：自分のエンドフェイズ時、相手の手札をランダムに1枚捨てる。\n●7体以上：自分エンドフェイズに相手に瑕疵を1つ与える。\n●11体以上：相手は神跡を得ることができない。"
  ),
  nexus(
    "フェアリー・ネクサス",
    "Neutral",
    "Fairy",
    "妖精",
    "自分フィールドの「妖精」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分の「妖精」の系譜を持つユニットの召喚コスト-1。\n●5体以上：相手がレコードに置くカードは全てインアクティブで置かれる。\n●7体以上：相手が召喚するユニットは全てインアクティブで召喚される。\n●11体以上：自分フィールドの「妖精」の系譜を持つユニットの効果は無効化されない。"
  ),
  nexus(
    "スピリット・ネクサス",
    "Neutral",
    "Spirit",
    "精霊",
    "自分フィールドの「精霊」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分フィールドに存在する属性と同じ属性を持つカードのコスト−1。\n●5体以上：魔法が墓地に送られるたびに、自分のレコード1枚をアクティブ状態にする。\n●7体以上：相手は自身のフィールドに存在しない属性の魔法を使用できない。\n●11体以上：自分の魔法の効果は無効化されない。"
  ),
  nexus(
    "マシン・ネクサス",
    "Neutral",
    "Mechanic",
    "機械",
    "自分フィールドの「機械」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分エンドフェイズ時、ロボットトークン（Lv1・HP/ATK 500/500・無属性・機械系譜）1体をコストを支払わずに召喚する。\n●5体以上：自分エンドフェイズ時、自分フィールドの「機械」の系譜を持つユニットの数だけ相手のデッキの上からカードを墓地に送る。\n●7体以上：相手は手札を公開しながら神征を進行する。\n●11体以上：相手のネクサスの効果を無効にする。"
  ),
  nexus(
    "ヒューマン・ネクサス",
    "Neutral",
    "Human",
    "真人",
    "自分フィールドの「真人」の系譜を持つユニットの数に応じて以下の効果を適用する。\n●3体以上：自分フィールドの「真人」の系譜を持つユニット1体につき自分フィールドのユニット全てを+100/+100。\n●5体以上：自分が使用するアイテムのコスト−1。\n●7体以上：相手が使用する魔法のコスト+1。\n●11体以上：お互いに「真人」の系譜を持たないユニットの効果を発動できない。"
  ),
  nexus(
    "ドラゴン・ネクサス",
    "Neutral",
    "Dragon",
    "竜",
    "自分フィールドの「竜」の系譜を持つユニットの数に応じて、自分フィールドの「竜」の系譜を持つユニットに以下の効果を適用する。\n●3体以上：ATK+2000。\n●5体以上：バースト+1。\n●7体以上：相手ユニットを指定して攻撃できる。\n●11体以上：相手の効果を受けない。"
  ),
  nexus(
    "ビースト・ネクサス",
    "Earth",
    "Beast",
    "獣",
    "自分フィールドの「獣」の系譜を持つユニットの数に応じて、自分フィールドの「獣」の系譜を持つユニットに以下の効果を適用する。\n●3体以上：ATK+1000。\n●5体以上：バースト+1。\n●7体以上：アタック中に受けるダメージは0になる。\n●11体以上：ブロックされない。"
  ),
  nexus(
    "アンデッド・ネクサス",
    "Dark",
    "Undead",
    "不死",
    "自分墓地の「不死」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n●3体以上：自分フィールドの「不死」の系譜を持つユニットのHP−1000（0になる場合は1残る）・ATK+2000。\n●5体以上：自分の墓地に存在する「不死」の系譜を持つユニット1体につき相手のユニット全てのHP−200。\n●7体以上：自分の墓地のカードは相手の効果を受けない。\n●11体以上：自分は墓地の「不死」の系譜を持つユニットを召喚できる。",
    { mill: true }
  ),
  nexus(
    "カオス・ネクサス",
    "Light",
    "Chaos",
    "混沌",
    "自分フィールドの「混沌」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n●3体以上：自分フィールドの光属性ユニットの属性は「闇」としても扱い、闇属性ユニットの属性は「光」としても扱う。\n●5体以上：お互いの除外状態のカード1枚につき、自分フィールドの光・闇属性ユニット全てを+200/+200。\n●7体以上：お互いの墓地へ送られるカードは全て除外される。\n●11体以上：お互いの地・水・火・風属性カードの効果を無効にする。",
    { extraRule: "このカードの属性は「闇」としても扱う。" }
  ),
  nexus(
    "ライデン・ネクサス",
    "Neutral",
    "Raiden",
    "雷電",
    "自分フィールドの「雷電」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n●3体以上：コストを支払って【カウンター】効果を発動する際、代わりにこのカードをインアクティブにできる。\n●5体以上：1ターンに1度、自分が【カウンター】効果を発動した時、デッキから1枚ドローする。\n●7体以上：自分フィールドの「雷電」の系譜を持つユニットがダメージを受ける場合、代わりにダメージを受けるユニット1体につき1枚、自分の墓地の【カウンター】効果を持つカードを除外できる。\n●11体以上：自分が【カウンター】効果を発動した時、相手に瑕疵を1つ与える。"
  ),
  nexus(
    "ガーディアン・ネクサス",
    "Neutral",
    "Guardian",
    "守護",
    "自分フィールドの「守護」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n●3体以上：自分フィールドの「守護」の系譜を持つユニットが受けるダメージ-2000。\n●5体以上：自分フィールドの「守護」の系譜を持つユニットはインアクティブ状態でもブロックできる。\n●7体以上：このカードのコントローラーは相手の効果を受けない。\n●11体以上：相手のターン終了時、そのターン中、自分が瑕疵を受けていない場合、相手に瑕疵を1つ与える。"
  ),

  // ── バニラユニット14種 ──
  vanilla("v-magi", "幼き魔法使い", 1, "Neutral", 1000, 500, "Magi"),
  vanilla("v-fairy", "霧の妖精", 1, "Wind", 1000, 1000, "Fairy"),
  vanilla("v-spirit-earth", "地の下級精霊", 3, "Earth", 4000, 2000, "Spirit"),
  vanilla("v-spirit-water", "水の下級精霊", 3, "Water", 5000, 1000, "Spirit"),
  vanilla("v-spirit-fire", "炎の下級精霊", 3, "Fire", 2000, 4000, "Spirit"),
  vanilla("v-spirit-wind", "風の下級精霊", 3, "Wind", 3000, 3000, "Spirit"),
  vanilla("v-spirit-light", "光の下級精霊", 3, "Light", 3500, 2500, "Spirit"),
  vanilla("v-spirit-dark", "闇の下級精霊", 3, "Dark", 2500, 3500, "Spirit"),
  vanilla("v-drone", "偵察ドローン", 1, "Neutral", 1000, 500, "Mechanic"),
  vanilla("v-robot", "量産型ロボット", 2, "Neutral", 2000, 2000, "Mechanic"),
  vanilla("v-soldier", "機械兵", 3, "Neutral", 5000, 1000, "Mechanic"),
  vanilla("v-beast", "群れ成す獣", 1, "Neutral", 1000, 1000, "Beast"),
  vanilla("v-wraith", "死霊", 1, "Dark", 1000, 0, "Undead"),
  vanilla("v-zombie", "生ける屍", 2, "Dark", 1000, 2000, "Undead"),

  // ── 追加ユニット（バニラ） ──
  unit("v-chimera", "合成獣キマイラ", 5, "Earth", 7000, 3000, ["Magi", "Beast"]),
  unit("v-wild-beast", "野生の獣", 2, "Earth", 1000, 1500, ["Beast"]),
  unit("v-lone-wolf", "一匹狼", 3, "Earth", 2000, 3000, ["Beast"]),
  unit("v-hatchling", "幼竜", 2, "Neutral", 2000, 1000, ["Dragon"]),
  unit("v-degraded-dragon", "劣化竜", 3, "Neutral", 4000, 1000, ["Dragon"]),
  unit("v-twin-dragon", "双剣竜", 5, "Wind", 5000, 2000, ["Dragon"], { burst: 2 }),
  unit("v-breeze-fairy", "そよ風の妖精", 1, "Wind", 1000, 500, ["Fairy"]),
  unit("v-thorn-fairy", "茨の妖精", 2, "Earth", 1000, 2000, ["Fairy"]),
  unit("v-wandering-soul", "彷徨う魂", 3, "Dark", 2000, 2000, ["Undead"]),
  unit("v-baby-angel", "ベビーエンジェル", 1, "Light", 1000, 500, ["Angel"]),
  unit("v-light-angel", "光翼の天使", 3, "Light", 4000, 1000, ["Angel"]),
  unit("v-villager", "村人", 1, "Neutral", 1000, 1000, ["Human"]),
  unit("v-light-factor", "光の因子", 2, "Light", 2000, 1000, ["Chaos"]),
  unit("v-dark-factor", "闇の因子", 2, "Dark", 1000, 2000, ["Chaos"]),
  unit("v-chaos-soul", "混沌の魂", 3, "Dark", 3000, 3000, ["Chaos"]),

  // ── 追加ユニット（効果持ち） ──
  unit("u-magic-recorder", "マジック・レコーダー", 4, "Neutral", 4000, 2000, ["Magi", "Memory"], {
    effects: [
      { label: "【召喚時】", text: "自分の墓地の魔法カード1枚を手札に加える。" },
    ],
  }),
  unit("u-scapegoat", "スケープゴート", 1, "Earth", 1000, 0, ["Beast"], {
    effects: [
      {
        label: "【永続】",
        text: "自分のユニット1体のみがダメージを受ける場合、そのダメージは代わりにこのカードが受ける。",
      },
    ],
  }),
  unit("u-beast-tamer", "ビーストテイマー", 3, "Earth", 3000, 0, ["Human", "Beast"], {
    effects: [
      { label: "【永続】", text: "自分フィールドの「獣」の系譜を持つユニット全てのATK+1000。" },
    ],
  }),
  unit("u-dragon-priestess", "竜の巫女", 3, "Neutral", 2000, 0, ["Human", "Dragon"], {
    effects: [{ label: "【永続】", text: "「竜」の系譜を持つユニットのコスト-2。" }],
  }),

  // ── 魔法 ──
  spell("m-fireball", "ファイアー・ボール", 3, "Fire", "Magic", "NormalMagic", [
    { label: "【起動】", text: "ユニット1体を選び、5000ダメージを与える。" },
  ]),
  spell("m-water-splash", "ウォーター・スプラッシュ", 3, "Water", "Magic", "NormalMagic", [
    { label: "【起動】", text: "相手フィールドのユニット全てに、2000ダメージを与える。" },
  ]),
  spell("m-wind-edge", "ウィンド・エッジ", 3, "Wind", "Magic", "NormalMagic", [
    {
      label: "【起動】",
      text: "ユニット1体を選び、3500ダメージを与える。その後、他のユニット1体に1500ダメージを与える。",
    },
  ]),
  spell("m-earth-spike", "アース・スパイク", 3, "Earth", "Magic", "NormalMagic", [
    { label: "【起動】", text: "相手のインアクティブ状態のユニット全てに、3000ダメージを与える。" },
  ]),
  spell("m-holy-breath", "ホーリー・ブレス", 3, "Light", "Magic", "NormalMagic", [
    {
      label: "【起動】",
      text: "ユニット1体を選び、3000ダメージを与える。選んだユニットが自分のユニットの場合、代わりにそのユニットのHPを4000回復する。",
    },
  ]),
  spell("m-dark-shot", "ダーク・ショット", 3, "Dark", "Magic", "NormalMagic", [
    { label: "【起動】", text: "ユニット1体を選び、そのユニットのHP-3000。" },
  ]),
  spell("m-thunder-blast", "サンダー・ブラスト", 4, "Neutral", "Magic", "NormalMagic", [
    {
      label: "【起動】",
      text: "ユニット1体に4000ダメージを与える。この効果でダメージを与えたユニットはこのターンの間、アタック/ブロックできない。",
    },
  ]),
  spell("m-d-access", "Dアクセス", 3, "Neutral", "Magic", "NormalMagic", [
    { label: "【起動】", text: "自分は２枚ドローする。" },
  ]),
  spell("m-savior-journey", "救世の旅路", 5, "Neutral", "Magic", "PersistentMagic", [
    {
      label: "【起動】",
      text: "このカード名の【起動】効果は1ターンに1度しか使用できない。自分のSユニットが「救世神器　レイ」の場合、このカードをインアクティブにして発動出来る。デッキの上から3枚を確認し、ネクサスカード１枚を手札に加え、残ったカードを墓地へ送る。",
    },
  ]),

  // ── アイテム ──
  spell("i-seal-stone", "魔封石", 3, "Neutral", "Item", "NormalItem", [
    {
      label: "【起動】",
      text: "自分メインフェイズ開始時のみ、このカードを使用できる。このターンの間、フィールドの魔法カードの効果は無効になる。",
    },
  ]),
  spell("i-rl-machine", "強化学習装置", 2, "Neutral", "Item", "NormalItem", [
    {
      label: "【起動】",
      text: "自分のデッキの１番上のカードを、自分のレコードゾーンに置く。",
    },
  ]),
];

// コスト→名前で安定ソート
export function getSortedCards(cards: GameCard[] = CARDS): GameCard[] {
  return [...cards].sort(
    (a, b) => a.cost - b.cost || a.name.localeCompare(b.name, "ja")
  );
}
