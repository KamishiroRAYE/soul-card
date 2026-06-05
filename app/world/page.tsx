import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/Section";
import { ATTRIBUTES, LINEAGES } from "@/lib/data";

export const metadata: Metadata = {
  title: "世界観",
  description: "8つの属性、22の系譜が織りなす Soul Record - Soul Card の世界観。",
};

export default function WorldPage() {
  return (
    <>
      <PageHeader
        eyebrow="WORLD & STORY"
        title="世界観"
        lead="魂が記録され、語り継がれる世界。8つの属性と22の系譜が、終わらない物語を紡いでいく。"
      />

      <Section title="この世界について">
        <div className="space-y-4 leading-relaxed text-foreground/90">
          <p>
            この世界に起きたすべての出来事は、ひとつ残らず
            <strong className="text-gold-bright">〈記録（レコード）〉</strong>
            として刻まれている。星の生まれた瞬間も、無数の戦いも、ひとつの想いも――
            あらゆる事象は記録となって、世界という大きな書物に綴られていく。
          </p>
          <p>
            その頁を書き換える力を持つのが、
            <strong className="text-gold-bright">〈魂（ソウル）〉</strong>
            を宿した者たちだ。彼らは記録に干渉し、自らの意志で世界の続きを描こうとする。
            魂と魂がぶつかり合うとき、記録は揺らぎ、世界は新たな一頁を迎える。
          </p>
          <p>
            戦いの果てに刻まれるのが
            <strong className="text-gold-bright">〈神跡（しんせき）〉</strong>
            ――至高の座
            <strong className="text-gold-bright">〈神座（しんざ）〉</strong>
            へと至る道のりを示す指標である。
            神跡を極めた魂は神座へと辿り着き、力尽きた魂はその座から遠ざかっていく。
            これは、記録を巡る魂たちの終わらない物語だ。
          </p>
          <Note>
            ※ 上記はゲーム内の用語（記録・魂・神跡・神座）に沿った導入文です。
            固有のキャラクター・地名・年代史などを加えたい場合は、設定を教えてください。
          </Note>
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

      <Section title="22の系譜">
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
                {l.en}
              </p>
            </div>
          ))}
        </div>
        <Note>
          ※ 各系譜の関係性・物語はこれから追加します。「今回は主要〇勢力を紹介」と
          少しずつ掘り下げる連載形式にすると読みやすくなります。
        </Note>
      </Section>

      <Section title="物語のはじまり">
        <div className="space-y-4 leading-relaxed text-foreground/90">
          <p>
            ――かつてないほど記録が揺らいでいる。神座へ至る道が開かれた今、
            22の系譜は、それぞれの理想を懸けて魂をぶつけ合う。
          </p>
          <p>
            あなたもまた、ひとつの魂を率いる者。相棒となる
            <strong className="text-gold-bright">ソウルユニット</strong>
            を選び、神跡を巡る戦いへ足を踏み入れる。
            この世界の続きを記録するのは、果たして誰の魂か。
          </p>
          <p className="text-muted">
            ――その答えは、あなた自身のデッキで確かめてほしい。
          </p>
          <Note>
            ※ プロローグの叩き台です。具体的な主人公・事件・舞台が決まれば、
            それに合わせて書き換えられます。
          </Note>
        </div>
      </Section>
    </>
  );
}
