# 簡単microbit教室

[microbit.org](https://microbit.org/) の公式教材を使って、家庭で micro:bit を独学するための道案内サイトです。
親子で・子どもだけで・大人だけで、それぞれ進めやすいように、課題ごとに案内を用意しています。

公開先: https://tmdoi.github.io/easy-microbit/

micro:bit Educational Foundation とは関係のない、非公式のサイトです。

## しくみ

- **学年別ふりがな**：入口診断で選んだ学年に合わせて、まだ習っていない漢字にだけふりがなを付けます。
  - ビルド時に形態素解析（kuromoji）で読みを求め、語ごとに学年つきのルビ（`<ruby class="g4">`）を付けます。
  - 語の学年 ＝ 含まれる漢字の配当学年の最大値（小学校で習わない漢字は 7）。
  - 表示の切り替えは CSS だけで行います（`scripts/gen-ruby-css.mjs` が生成）。
- **個人情報を扱わない**：学年や進み具合は、ブラウザの localStorage にだけ保存します。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321/easy-microbit/
npm run build    # dist/ に出力
```

main ブランチに push すると、GitHub Actions で GitHub Pages に公開されます。

## 課題ページを書く

`src/pages/lessons/<id>.md` に書き、`src/lib/lessons.js` の該当課題を `ready: true` にします。
見本は `src/pages/lessons/name-badge.md` です。

- `## こども` `## おやこ` `## おとな` の見出しが、そのままタブになります。
- `- [ ] 手順` と書くと、チェックできる手順になります（端末に保存されます）。
- 使う機器ごとの手順は `<div class="device" data-device="usb|mac|tablet">` で囲みます。
- 漢字にふりがなは書かなくてかまいません（自動で付きます）。
- `<name-scroller text="TARO" editable></name-scroller>` と書くと、micro:bit の LED に文字が流れる図が入ります。
  `editable` を付けると、読む人が文字を入力して試せます。文字の形は実機と同じ（codal-core のフォント、MIT License）です。

## ふりがなの読みを直す

読みの間違いを見つけたら、`src/lib/yomi-dict.json` に `"語": "よみ"` を追加してください。
送りがなは自動でルビの外に出ます（`"書き込み": "かきこみ"` → 書き込[かきこ]み）。

## ライセンス

- プログラム：MIT License
- 文章：CC BY-SA 4.0
- 漢字の学年データ：文部科学省「学年別漢字配当表」（2020年度施行）。データは [ffe4/kanji-lists](https://github.com/ffe4/kanji-lists)（MIT License）を利用。
