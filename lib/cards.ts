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

// 魔法・アイテム（HP/攻撃力・系譜を持たない）
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
      { label: "【進化】", text: "最大HP+攻撃力が25000以上のSユニット1体。" },
      {
        text: "自分フィールド・墓地のネクサス1枚につきこのカードの進化コスト−1。",
      },
      {
        text: "このカードの進化は無効化されず、このカードの進化時、相手は効果を使用・及び適用できない。",
      },
      {
        label: "【誘発：S】",
        text:
          "この神征中、以下の効果全てを適用する。この効果は無効化されない。\n" +
          "・自分・相手の各フェイズ開始・終了時、自分フィールド・墓地・レコードゾーンのネクサスカード1枚をこのカードの進化素材にできる。\n" +
          "・このカードが12枚以上のネクサスカードを進化素材に持つ場合、自分の神跡は12になる。",
      },
    ],
  },

  // ── 系譜ネクサス13種 ──
  nexus(
    "マギ・ネクサス",
    "Neutral",
    "Magi",
    "魔導",
    "自分フィールドの「魔導」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分の「魔導」の系譜を持つユニットの攻撃力+1000。\n・5体以上：自分が使用する魔法のコスト-1。\n・7体以上：自分の「魔導」の系譜を持つユニットのバースト+1。\n・11体以上：自分の「魔導」の系譜を持つユニットは効果ダメージを受けない。"
  ),
  nexus(
    "エンジェル・ネクサス",
    "Light",
    "Angel",
    "天使",
    "自分フィールドの「天使」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分の「天使」の系譜を持つユニットのHP+1000。\n・5体以上：自分のドローフェイズの通常ドロー枚数+1。\n・7体以上：自分のターン開始時に神跡を1つ得る。\n・11体以上：自分への瑕疵を無効にする。"
  ),
  nexus(
    "デビル・ネクサス",
    "Dark",
    "Demon",
    "悪魔",
    "自分フィールドの「悪魔」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分の「悪魔」の系譜を持つユニットの攻撃力+1000。\n・5体以上：自分のエンドフェイズ時、相手の手札をランダムに1枚捨てる。\n・7体以上：自分エンドフェイズに相手に瑕疵を1つ与える。\n・11体以上：相手は神跡を得ることができない。"
  ),
  nexus(
    "フェアリー・ネクサス",
    "Neutral",
    "Fairy",
    "妖精",
    "自分フィールドの「妖精」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分の「妖精」の系譜を持つユニットの召喚コスト-1。\n・5体以上：相手がレコードに置くカードは全てインアクティブで置かれる。\n・7体以上：相手が召喚するユニットは全てインアクティブで召喚される。\n・11体以上：自分フィールドの「妖精」の系譜を持つユニットの効果は無効化されない。"
  ),
  nexus(
    "スピリット・ネクサス",
    "Neutral",
    "Spirit",
    "精霊",
    "自分フィールドの「精霊」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分フィールドに存在する属性と同じ属性を持つカードのコスト−1。\n・5体以上：魔法が墓地に送られるたびに、自分のレコード1枚をアクティブ状態にする。\n・7体以上：相手は自身のフィールドに存在しない属性の魔法を使用できない。\n・11体以上：自分の魔法の効果は無効化されない。"
  ),
  nexus(
    "マシン・ネクサス",
    "Neutral",
    "Mechanic",
    "機械",
    "自分フィールドの「機械」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分エンドフェイズ時、ロボットトークン（Lv1・HP/攻撃力 500/500・無属性・機械系譜）1体をコストを支払わずに召喚する。\n・5体以上：自分エンドフェイズ時、自分フィールドの「機械」の系譜を持つユニットの数だけ相手のデッキの上からカードを墓地に送る。\n・7体以上：相手は手札を公開しながら神征を進行する。\n・11体以上：相手のネクサスの効果を無効にする。"
  ),
  nexus(
    "ヒューマン・ネクサス",
    "Neutral",
    "Human",
    "真人",
    "自分フィールドの「真人」の系譜を持つユニットの数に応じて以下の効果を適用する。\n・3体以上：自分フィールドの「真人」の系譜を持つユニット1体につき自分フィールドのユニット全てを+100/+100。\n・5体以上：自分が使用するアイテムのコスト−1。\n・7体以上：相手が使用する魔法のコスト+1。\n・11体以上：お互いに「真人」の系譜を持たないユニットの効果を発動できない。"
  ),
  nexus(
    "ドラゴン・ネクサス",
    "Neutral",
    "Dragon",
    "竜",
    "自分フィールドの「竜」の系譜を持つユニットの数に応じて、自分フィールドの「竜」の系譜を持つユニットに以下の効果を適用する。\n・3体以上：攻撃力+2000。\n・5体以上：バースト+1。\n・7体以上：相手ユニットを指定して攻撃できる。\n・11体以上：相手の効果を受けない。"
  ),
  nexus(
    "ビースト・ネクサス",
    "Earth",
    "Beast",
    "獣",
    "自分フィールドの「獣」の系譜を持つユニットの数に応じて、自分フィールドの「獣」の系譜を持つユニットに以下の効果を適用する。\n・3体以上：攻撃力+1000。\n・5体以上：バースト+1。\n・7体以上：アタック中に受けるダメージは0になる。\n・11体以上：ブロックされない。"
  ),
  nexus(
    "アンデッド・ネクサス",
    "Dark",
    "Undead",
    "不死",
    "自分墓地の「不死」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n・3体以上：自分フィールドの「不死」の系譜を持つユニットのHP−1000（0になる場合は1残る）・攻撃力+2000。\n・5体以上：自分の墓地に存在する「不死」の系譜を持つユニット1体につき相手のユニット全てのHP−200。\n・7体以上：自分の墓地のカードは相手の効果を受けない。\n・11体以上：自分は墓地の「不死」の系譜を持つユニットを召喚できる。",
    { mill: true }
  ),
  nexus(
    "カオス・ネクサス",
    "Light",
    "Chaos",
    "混沌",
    "自分フィールドの「混沌」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n・3体以上：自分フィールドの光属性ユニットの属性は「闇」としても扱い、闇属性ユニットの属性は「光」としても扱う。\n・5体以上：お互いの除外状態のカード1枚につき、自分フィールドの光・闇属性ユニット全てを+200/+200。\n・7体以上：お互いの墓地へ送られるカードは全て除外される。\n・11体以上：お互いの地・水・火・風属性カードの効果を無効にする。",
    { extraRule: "このカードの属性は「闇」としても扱う。" }
  ),
  nexus(
    "ライデン・ネクサス",
    "Neutral",
    "Raiden",
    "雷電",
    "自分フィールドの「雷電」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n・3体以上：コストを支払って【カウンター】効果を発動する際、代わりにこのカードをインアクティブにできる。\n・5体以上：1ターンに1度、自分が【カウンター】効果を発動した時、デッキから1枚ドローする。\n・7体以上：自分フィールドの「雷電」の系譜を持つユニットがダメージを受ける場合、代わりにダメージを受けるユニット1体につき1枚、自分の墓地の【カウンター】効果を持つカードを除外できる。\n・11体以上：自分が【カウンター】効果を発動した時、相手に瑕疵を1つ与える。"
  ),
  nexus(
    "ガーディアン・ネクサス",
    "Neutral",
    "Guardian",
    "守護",
    "自分フィールドの「守護」の系譜を持つユニットの数に応じて、以下の効果を適用する。\n・3体以上：自分フィールドの「守護」の系譜を持つユニットが受けるダメージ-2000。\n・5体以上：自分フィールドの「守護」の系譜を持つユニットはインアクティブ状態でもブロックできる。\n・7体以上：このカードのコントローラーは相手の効果を受けない。\n・11体以上：相手のターン終了時、そのターン中、自分が瑕疵を受けていない場合、相手に瑕疵を1つ与える。"
  ),

  // ── バニラユニット14種 ──
  vanilla("v-magi", "幼き魔法使い", 1, "Neutral", 1000, 500, "Magi"),
  vanilla("v-fairy", "霧の妖精", 1, "Water", 1000, 1000, "Fairy"),
  vanilla("v-spirit-earth", "地の下級精霊", 3, "Earth", 4000, 2000, "Spirit"),
  vanilla("v-spirit-water", "水の下級精霊", 3, "Water", 5000, 1000, "Spirit"),
  vanilla("v-spirit-fire", "炎の下級精霊", 3, "Fire", 2000, 4000, "Spirit"),
  vanilla("v-spirit-wind", "風の下級精霊", 3, "Wind", 3000, 3000, "Spirit"),
  vanilla("v-spirit-light", "光の下級精霊", 3, "Light", 3500, 2500, "Spirit"),
  vanilla("v-spirit-dark", "闇の下級精霊", 3, "Dark", 2500, 3500, "Spirit"),
  vanilla("v-drone", "偵察ドローン", 1, "Neutral", 1000, 500, "Mechanic"),
  vanilla("v-robot", "量産型ロボット", 2, "Neutral", 2000, 2000, "Mechanic"),
  vanilla("v-soldier", "機械兵", 3, "Neutral", 5000, 1000, "Mechanic"),
  vanilla("v-beast", "群れ成す獣", 1, "Earth", 1000, 1000, "Beast"),
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
      { label: "【永続】", text: "自分フィールドの「獣」の系譜を持つユニット全ての攻撃力+1000。" },
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

  // ── 妖怪バッチ（15種） ──
  vanilla("y-nue", "鵺", 4, "Dark", 4000, 5000, "Beast"),
  vanilla("y-orochi", "八岐大蛇", 8, "Water", 12000, 8000, "Dragon"),
  vanilla("y-omukade", "大百足", 5, "Earth", 6500, 5500, "Insect"),
  unit("y-kamaitachi", "鎌鼬", 3, "Wind", 2000, 4500, ["Beast"], { burst: 2 }),
  vanilla("y-yamauba", "山姥", 3, "Earth", 4500, 2000, "Demon"),
  vanilla("y-tsuchigumo", "土蜘蛛", 4, "Earth", 5500, 3500, "Primordial"),
  unit("y-ushioni", "牛鬼", 5, "Water", 4000, 5000, ["Demon"], {
    effects: [
      {
        label: "【召喚・破壊時】",
        text: "相手フィールドのユニット1体を対象として発動できる。そのユニットに3000ダメージを与える。",
      },
    ],
  }),
  unit("y-tamamo", "玉藻前", 9, "Fire", 9000, 9000, ["Mystic"], {
    effects: [
      {
        label: "【破壊時】",
        text:
          "このカードを以下の効果を持つ永続アイテム扱いでフィールドに残す。\n" +
          "●【永続】アタックした相手のユニットは4000ダメージを受ける。",
      },
    ],
  }),
  unit("y-jorogumo", "女郎蜘蛛", 4, "Dark", 3000, 3000, ["Insect"], {
    effects: [
      {
        label: "【起動】",
        text: "このユニットをインアクティブにして発動できる。相手は手札を1枚捨ててこの効果を無効にできる。捨てなかった場合、相手ユニット1体に5000ダメージを与える。",
      },
    ],
  }),
  unit("y-kudan", "件", 3, "Earth", 1000, 0, ["Beast"], {
    effects: [
      { label: "【召喚時】", text: "発動できる。このユニットを破壊し、自分は2枚ドローする。" },
    ],
  }),
  unit("y-umibozu", "海坊主", 6, "Water", 9000, 6000, ["Ocean"], {
    effects: [
      { label: "【召喚時】", text: "発動できる。フィールドの「海洋」の系譜を持たないカード1枚を破壊する。" },
      {
        label: "【永続】",
        text: "自分フィールドに存在する他の「海坊主」1体につき、このカードのバースト+1。",
      },
    ],
  }),
  unit("y-raiju", "雷獣", 4, "Wind", 2500, 4500, ["Beast", "Raiden"], {
    effects: [
      {
        label: "【召喚時】",
        text: "相手フィールドのユニット1体を対象として発動できる。そのユニットに4000ダメージを与える。",
      },
    ],
  }),
  unit("y-onamazu", "大鯰", 5, "Earth", 7000, 2000, ["GrandEarth"], {
    effects: [
      {
        label: "【起動】",
        text: "1コスト支払って発動できる。Lv.8以下の相手ユニット1体をインアクティブにする。",
      },
    ],
  }),
  unit("y-nureonna", "濡女", 3, "Water", 2000, 3000, ["Demon"], {
    effects: [
      {
        label: "【起動】",
        text: "1ターンに1度、発動できる。相手は1枚ドローし、その後手札を1枚捨てる。",
      },
      {
        label: "【起動】",
        text: "このカードの効果で、相手がカードをドローしたターンに、このカードをリリースして発動できる。自分は手札から「牛鬼」1体をコストを支払わずに召喚する。",
      },
    ],
  }),
  unit("y-mikuzume", "藻女", 1, "Neutral", 1000, 1000, [], {
    effects: [
      {
        label: "【永続】",
        text: "フェイズ開始時に手札を1枚捨てて発動できる。このカードをLv+1し、攻撃力+1000／HP+1000する。",
      },
      {
        label: "【起動】",
        text: "攻撃力9000以上のこのカードをリリースして発動できる。手札・デッキ・墓地から「玉藻前」1体をコストを支払わずに召喚する。",
      },
    ],
  }),

  // ── 北欧神話バッチ（8種） ──
  unit("n-fenrir", "フェンリル", 9, "Dark", 6000, 12000, ["Beast", "Giant"], {
    effects: [{ label: "【召喚時】", text: "発動できる。相手フィールドのユニット1体を破壊する。" }],
  }),
  unit("n-jormungandr", "ヨルムンガンド", 9, "Water", 18000, 4000, ["Dragon", "Spirit", "Giant"], {
    effects: [
      { label: "【永続】", text: "このカードはインアクティブ状態でもブロックできる。" },
    ],
  }),
  unit("n-nidhogg", "ニーズヘッグ", 7, "Dark", 8000, 5000, ["Dragon"], {
    effects: [
      {
        label: "【永続】",
        text: "ユニットが墓地へ送られる度に、このユニットのHPは2000回復する。",
      },
    ],
  }),
  unit("n-surt", "スルト", 10, "Fire", 10000, 12000, ["Primordial", "GrandEarth", "Giant"], {
    effects: [
      { label: "【永続】", text: "このカード名のカードは自分フィールドに1枚しか存在できない。" },
      { label: "【召喚時】", text: "発動できる。フィールドに存在する他のユニット全てに10000ダメージを与える。" },
    ],
  }),
  unit("n-frost-giant", "霜の巨人", 6, "Water", 9500, 6500, ["Spirit", "Giant"]),
  vanilla("n-draugr", "ドラウグ", 2, "Dark", 3000, 1000, "Undead"),
  vanilla("n-kraken", "クラーケン", 8, "Water", 11000, 8000, "Ocean"),
  vanilla("n-mara", "マーラ", 2, "Dark", 2000, 2500, "Demon"),

  // ── ギリシャ神話バッチ（20種） ──
  unit("g-chimera", "キマイラ", 6, "Wind", 6000, 7000, ["Beast", "Spirit"]),
  vanilla("g-minotaur", "ミノタウロス", 4, "Earth", 4000, 5000, "Beast"),
  vanilla("g-griffon", "グリフォン", 4, "Wind", 4000, 5000, "Ether"),
  unit("g-harpy", "ハルピュイア", 3, "Wind", 2500, 4000, ["Avian"], { burst: 2 }),
  unit("g-scylla", "スキュラ", 5, "Water", 4000, 3000, ["Ocean"], { burst: 2 }),
  unit("g-hydra", "ヒュドラ", 7, "Water", 9000, 7000, ["Dragon", "Mystic"], {
    effects: [{ label: "【永続】", text: "このカードは炎属性以外のカードによるダメージを受けない。" }],
  }),
  unit("g-cerberus", "ケルベロス", 8, "Dark", 9000, 6000, ["Beast", "Underworld"], {
    effects: [{ label: "【永続】", text: "相手は墓地からユニットを召喚できない。" }],
  }),
  unit("g-medusa", "メドゥーサ", 5, "Earth", 5000, 3000, ["Mystic"], {
    effects: [{ label: "【アタック時】", text: "このユニットをブロックしたユニットの攻撃力は0になる。" }],
  }),
  unit("g-manticore", "マンティコア", 5, "Fire", 6000, 5000, ["Beast"], {
    effects: [
      { label: "【永続】", text: "このカードが「真人」の系譜を持つユニットと戦闘を行う場合、このカードの攻撃力は倍になる。" },
    ],
  }),
  unit("g-siren", "セイレーン", 3, "Water", 2500, 2000, ["Ocean"], {
    effects: [
      {
        label: "【召喚時】",
        text: "相手フィールドのユニット1体を対象として発動できる。そのユニットをインアクティブにする。",
      },
    ],
  }),
  unit("g-talos", "タロス", 5, "Neutral", 9000, 4000, ["Human"], {
    effects: [{ label: "【永続】", text: "このカードは、可能なら必ずブロックしなければならない。" }],
  }),
  unit("g-echidna", "エキドナ", 6, "Dark", 10000, 3000, ["Primordial"], {
    effects: [{ label: "【永続】", text: "自分のLV.5～8のユニットの召喚コスト-2。" }],
  }),
  unit("g-ladon", "ラドン", 7, "Earth", 10000, 4500, ["Dragon"], {
    effects: [{ label: "【永続】", text: "このカードは、インアクティブ状態でもブロックできる。" }],
  }),
  unit("g-mormo", "モルモー", 3, "Dark", 3000, 1500, ["Demon"], {
    effects: [
      {
        label: "【アタック時】",
        text: "発動できる。このユニットがブロックしたユニットに戦闘でダメージを与えた場合、その数値分このカードのHPを回復する。",
      },
    ],
  }),
  unit("g-banshee", "バンシー", 3, "Dark", 2000, 3000, ["Fairy"], {
    effects: [
      {
        label: "【召喚時】",
        text:
          "発動できる。次の自分のターン開始時まで、以下の効果を適用する。\n" +
          "●自分フィールドのユニットがダメージを受ける場合、1度だけデッキの上からカードを1枚墓地へ送ることで、そのダメージを無効にする。",
      },
    ],
  }),
  unit("g-redcap", "レッドキャップ", 3, "Dark", 1500, 3000, ["Fairy"], {
    effects: [
      {
        label: "【召喚時】",
        text: "相手フィールドのユニット1体を対象として発動できる。そのユニットに、このカードの攻撃力分のダメージを与える。",
      },
    ],
  }),
  unit("g-kelpie", "ケルピー", 4, "Water", 7000, 6000, ["Beast", "Demon"], {
    effects: [{ label: "【破壊時】", text: "発動する。自分は手札を1枚捨てる。" }],
  }),
  vanilla("g-wyvern", "ワイバーン", 4, "Wind", 4000, 5000, "Dragon"),
  unit("g-basilisk", "バジリスク", 6, "Dark", 6000, 3000, ["Dragon", "Mystic"], {
    effects: [{ label: "【永続】", text: "このユニットと戦闘を行ったユニットは破壊される。" }],
  }),
  unit("g-cockatrice", "コカトリス", 4, "Dark", 3000, 3000, ["Beast", "Mystic"], {
    effects: [{ label: "【召喚時】", text: "発動できる。デッキから「バジリスク」1枚を手札に加える。" }],
  }),

  // ── 中国神話バッチ（9種） ──
  vanilla("c-taotie", "饕餮", 7, "Earth", 11000, 6000, "Chaos"),
  unit("c-qiongqi", "窮奇", 5, "Wind", 5500, 6500, ["Beast", "Chaos"]),
  vanilla("c-hundun", "渾沌", 6, "Neutral", 7500, 6500, "Chaos"),
  vanilla("c-chiyou", "蚩尤", 7, "Water", 7000, 9000, "Raiden"),
  unit("c-hakutaku", "白澤", 5, "Light", 4000, 1000, ["Mystic"], {
    effects: [{ label: "【召喚時】", text: "発動できる。自分は2枚ドローする。" }],
  }),
  unit("c-qilin", "麒麟", 6, "Light", 9000, 3000, ["Beast", "Mystic"], {
    burst: 0,
    effects: [{ label: "【永続】", text: "お互いのユニットはアタックできない。" }],
  }),
  unit("c-hiderigami", "ひでりがみ", 4, "Fire", 3000, 3000, ["Undead"], {
    effects: [
      { label: "【起動】", text: "1ターンに1度、水属性カード1枚を対象として発動できる。その効果を無効にする。" },
    ],
  }),
  vanilla("c-houkou", "彭侯", 3, "Earth", 4000, 2500, "Spirit"),
  unit("c-kada", "化蛇", 4, "Water", 4000, 3000, ["Dragon"], {
    effects: [{ label: "【召喚時】", text: "発動できる。相手のデッキの上から5枚を墓地へ送る。" }],
  }),

  // ── インド神話バッチ（8種） ──
  unit("in-naga", "ナーガ", 5, "Water", 7000, 4000, ["Guardian", "Spirit", "Dragon"]),
  unit("in-rakshasa", "ラークシャサ", 6, "Dark", 6000, 8000, ["Demon", "Spirit"]),
  unit("in-garuda", "ガルダ", 8, "Wind", 4000, 10000, ["Undead", "Avian", "Ether"], {
    effects: [
      { label: "【永続】", text: "このカードは破壊されない。" },
      {
        label: "【アタック時】",
        text: "発動できる。相手フィールドの「竜」の系譜を持つユニット1体を破壊する。",
      },
    ],
  }),
  unit("in-asura", "アスラ", 6, "Fire", 6000, 4000, ["Demon"], { burst: 2 }),
  unit("in-vritra", "ヴリトラ", 8, "Dark", 9000, 4000, ["Dragon"], {
    effects: [
      { label: "【永続】", text: "このカードの属性は「炎」としても扱う。" },
      { label: "【永続】", text: "フィールドの水属性ユニットの最大HP-4000。" },
    ],
  }),
  vanilla("in-makara", "マカラ", 4, "Water", 5000, 4000, "Ocean"),
  unit("in-vetala", "ヴェターラ", 4, "Dark", 3000, 0, ["Undead"], {
    effects: [
      {
        label: "【召喚時】",
        text: "自分の墓地のユニット1体を対象として発動できる。このカードの攻撃力はそのユニットと同じになる。",
      },
    ],
  }),
  vanilla("in-pishacha", "ピシャーチャ", 2, "Dark", 2000, 2000, "Undead"),

  // ── 伝説の幻獣バッチ（5種） ──
  unit("l-azidahaka", "アジ・ダハーカ", 8, "Dark", 9000, 9000, ["Magi", "Avian", "Dragon"]),
  unit("l-behemoth", "ベヒモス", 8, "Earth", 10000, 10000, ["Beast", "GrandEarth"]),
  unit("l-simurgh", "シムルグ", 7, "Wind", 10000, 4000, ["Avian", "Ether"], {
    effects: [{ label: "【召喚時】", text: "デッキから「シムルグの羽根」1枚を手札に加える。" }],
  }),
  unit("l-leviathan", "リヴァイアサン", 8, "Water", 7000, 7000, ["Dragon", "Ocean", "Abyss"], {
    effects: [{ label: "【永続】", text: "このカードは戦闘ダメージを受けない。" }],
  }),
  spell("l-simurgh-feather", "シムルグの羽根", 4, "Wind", "Item", "NormalItem", [
    { label: "【起動】", text: "デッキから「シムルグ」カード1枚を手札に加える。" },
  ]),

  // ── アラビア神話バッチ（3種） ──
  vanilla("a-roc", "ロック鳥", 6, "Wind", 8500, 5500, "Avian"),
  vanilla("a-golem", "ゴーレム", 4, "Earth", 7000, 2000, "Mystic"),
  unit("a-ifrit", "イフリート", 5, "Fire", 4000, 5000, ["Spirit"], {
    effects: [{ label: "【永続】", text: "このカードは炎属性カードによるダメージを受けない。" }],
  }),

  // ── 未確認生物バッチ（4種） ──
  vanilla("cr-gevaudan", "ジェヴォーダンの獣", 5, "Dark", 5000, 7000, "Beast"),
  vanilla("cr-kobold", "コボルト", 2, "Earth", 2000, 2500, "Fairy"),
  vanilla("cr-werewolf", "狼男", 4, "Dark", 4000, 5000, "Beast"),
  unit("cr-strigoi", "ストリゴイ", 4, "Dark", 3000, 4000, ["Magi", "Undead"]),

  // ── メソポタミア神話バッチ（5種） ──
  unit("m-anzu", "アンズー", 6, "Wind", 6000, 8000, ["Raiden", "Ether"]),
  unit("m-tiamat", "ティアマト", 12, "Water", 20000, 7000, ["Chaos", "Primordial", "Ocean"], {
    effects: [
      { text: "このカードの効果は12コスト支払って召喚している場合のみ、使用できる。" },
      {
        label: "【召喚時】",
        text: "発動できる。レコードゾーンのカード全てをアクティブ状態にする。その後、デッキから種類(ユニット・魔法・アイテム・ネクサス)の異なるカードをそれぞれ1枚まで手札に加えることができる。",
      },
    ],
  }),
  unit("m-pazuzu", "パズズ", 8, "Wind", 9000, 7000, ["Guardian", "Demon"], {
    effects: [{ label: "【永続】", text: "このカードが「悪魔」の系譜を持つユニットによって受けるダメージは半分になる。" }],
  }),
  unit("m-humbaba", "フンババ", 7, "Earth", 10000, 3000, ["Guardian"], {
    effects: [{ label: "【永続】", text: "相手フィールドのLv.6以下のユニットはアタックできない。" }],
  }),
  unit("m-lamashtu", "ラマシュトゥ", 6, "Dark", 6500, 5000, ["Demon", "Mystic"], {
    effects: [{ label: "【召喚時】", text: "発動できる。相手フィールドのLv.4以下のユニットを3体まで墓地へ送る。" }],
  }),

  // ── スラヴ神話バッチ（3種） ──
  vanilla("s-rusalka", "ルサールカ", 3, "Water", 4000, 2500, "Undead"),
  vanilla("s-leshy", "レーシー", 3, "Earth", 5000, 2000, "Spirit"),
  unit("s-babayaga", "バーバ・ヤーガ", 5, "Dark", 5000, 2000, ["Magi", "Mystic"], {
    effects: [
      {
        label: "【召喚時】",
        text:
          "以下の効果から1つを選んで発動できる。\n" +
          "●自分は2枚ドローする。\n" +
          "●デッキの上から5枚を墓地へ送る。",
      },
    ],
  }),

  // ── 世界神話バッチ（8種） ──
  unit("w-wendigo", "ウェンディゴ", 5, "Dark", 4000, 2000, ["Spirit"], {
    effects: [
      { label: "【永続】", text: "このカードは、相手の効果の対象にならない。" },
      { label: "【ブロック時】", text: "発動する。このカードをアタックしたユニットに装備する。" },
      {
        label: "【永続】",
        text: "このカードを装備したユニットは、アタック・ブロックできず、自分・相手のプライムフェイズ開始時に100ダメージを受ける。",
      },
    ],
  }),
  unit("w-tzitzimitl", "ツィツィミトル", 6, "Dark", 8000, 6000, ["Demon", "Ether"], {
    effects: [
      {
        label: "【フェーズ開始時】",
        text: "自分のドローフェイズ、ドロー前に手札を1枚捨てて発動できる。このターンの通常ドローの枚数は2枚になる。",
      },
    ],
  }),
  unit("w-ahuizotl", "アウィツォトル", 1, "Water", 1000, 0, ["Human"], {
    effects: [
      {
        label: "【起動】",
        text: "1コスト支払って発動できる。このカードのレベルを1つ上げる（最大7まで）。",
      },
      {
        label: "【永続】",
        text:
          "このカードは、このカードのレベルによって以下の効果を得る。\n" +
          "●1以上：このカードのLv.1につき、このカードを+1000/+1000。\n" +
          "●5以上：このカード以外の自分フィールドの全てのユニットの攻撃力+2000。\n" +
          "●7：バースト+1。",
      },
    ],
  }),
  unit("w-camazotz", "カマソッツ", 4, "Dark", 2500, 4500, ["Underworld"], {
    effects: [{ label: "【召喚時】", text: "発動できる。お互いは、自分フィールドのユニット1体を破壊する。" }],
  }),
  vanilla("w-chupacabra", "チュパカブラ", 2, "Dark", 3000, 2000, "Mystic"),
  unit("w-taniwha", "タニファ", 5, "Water", 8500, 3500, ["Guardian", "Ocean"]),
  vanilla("w-bunyip", "バニップ", 4, "Water", 5500, 3500, "Mystic"),
  vanilla("w-aigamucha", "アイガムシャ", 3, "Earth", 3500, 3000, "Demon"),
];

// コスト→名前で安定ソート
export function getSortedCards(cards: GameCard[] = CARDS): GameCard[] {
  return [...cards].sort(
    (a, b) => a.cost - b.cost || a.name.localeCompare(b.name, "ja")
  );
}
