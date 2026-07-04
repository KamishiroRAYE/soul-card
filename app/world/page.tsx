import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/Section";
import { ATTRIBUTES, LINEAGES } from "@/lib/data";

export const metadata: Metadata = {
  title: "世界観",
  description: "8つの属性、24の系譜が織りなす Soul Record - Soul Card の世界観。",
};

export default function WorldPage() {
  return (
    <>
      <PageHeader
        eyebrow="WORLD & STORY"
        title="世界観"
        lead="魂が記録され、語り継がれる世界。8つの属性と24の系譜が、終わらない物語を紡いでいく。"
      />

      <Section title="この世界について">
        <div className="space-y-4 leading-relaxed text-foreground/90">
          <p>
            <strong className="text-gold-bright">次元世界</strong>
            には、数多の神話・伝説に等しい
            <strong className="text-gold-bright">情報</strong>
            が漂っている。星を統べた竜の咆哮も、滅びた王国の祈りも、名もなき者の願いも――
            あらゆる物語が、形をなさぬまま次元の海をたゆたっている。
          </p>
          <p>
            プレイヤーは、その情報を己の魂――
            <strong className="text-gold-bright">ソウルカード</strong>
            に引き寄せる者。神に成るための資格
            <strong className="text-gold-bright">〈神跡（しんせき）〉</strong>
            を集める旅、
            <strong className="text-gold-bright">〈神征（しんせい）〉</strong>
            に挑む。
          </p>
          <p>
            <strong className="text-foreground">12 の神跡</strong>
            を集めた者は、神への階段を昇り切り――至高の座
            <strong className="text-gold-bright">〈神座（かむくら）〉</strong>
            へ到達して勝利する。
            すべての神跡を失った者は、神座への昇格資格を失い敗北する。
          </p>
        </div>
      </Section>

      <Section title="8つの属性">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted">
          世界を構成する力は、8つの属性に分かれています。属性はカードの個性であり、
          デッキの戦い方を方向づける最初の選択です。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {ATTRIBUTES.map((a) => (
            <div
              key={a.key}
              className="tile flex items-start gap-4 rounded-lg border border-border bg-surface p-5"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-xl font-bold text-background"
                style={{ background: a.color }}
              >
                {a.name}
              </span>
              <div>
                <p className="font-bold text-foreground">
                  {a.name}{" "}
                  <span className="ml-1 text-xs tracking-widest text-muted">
                    {a.en}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="24の系譜">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted">
          この世界に生きる存在たちは「系譜（けいふ）」と呼ばれる種族・勢力に属します。
          系譜は同じ物語を共有し、ときに手を取り、ときに激しく対立します。
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {LINEAGES.map((l) => (
            <div
              key={l.en}
              className="tile rounded-md border border-border bg-surface px-4 py-3 text-center"
            >
              <p className="font-serif font-bold text-gold-bright">{l.name}</p>
              <p className="mt-0.5 text-[0.65rem] tracking-widest text-muted">
                {l.enLabel ?? l.en}
              </p>
            </div>
          ))}
        </div>
        <Note>
          ※ 系譜そのものに固有の特殊ルールはありません。カードの効果・進化条件・
          ネクサス効果が参照する「種族」として働きます。
        </Note>
      </Section>

      <Section title="物語のはじまり">
        <div className="space-y-4 leading-relaxed text-foreground/90">
          <p>
            ――次元世界に、神座へ至る道が開かれた。漂う情報を読み取り、
            魂たちはそれぞれの理想を胸に
            <strong className="text-gold-bright">神征</strong>
            に身を投じる。
          </p>
          <p>
            あなたもまた、ひとつの魂を率いる者。相棒となる
            <strong className="text-gold-bright">ソウルユニット</strong>
            を選び、12 の神跡を求めて戦いへ足を踏み入れる。
            この世界の続きを記録するのは、果たして誰の魂か。
          </p>
          <p className="text-muted">
            ――その答えは、あなた自身のデッキで確かめてほしい。
          </p>
        </div>
      </Section>
    </>
  );
}
