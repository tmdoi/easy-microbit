---
layout: ../../layouts/Lesson.astro
id: name-badge
---

## こども

micro:bit に自分の名前を流して表示させよう。これが、きみのはじめてのプログラムだよ。

### できあがりのイメージ

できあがると、こんなふうに名前が右から左へ流れるよ。下の四角に自分の名前をローマ字で入れて、ためしてみよう。

<name-scroller text="TARO" editable></name-scroller>

### じゅんび

- [ ] micro:bit と USB ケーブルを用意した
- [ ] パソコンやタブレットで [MakeCode](https://makecode.microbit.org/) を開いた

<details>
<summary>micro:bit がなくても大丈夫？</summary>

大丈夫。MakeCode の画面の左にある「シミュレーター」の micro:bit で、動きをたしかめられるよ。

</details>

### つくりかた

まずは動画を見てみよう。そのあと、同じようにやってみよう。

<video class="howto" controls autoplay muted loop playsinline preload="metadata" poster="../../media/name-badge-howto.jpg" aria-label="MakeCode で名前バッジを作る手順の動画">
  <source src="../../media/name-badge-howto.webm" type="video/webm">
  <source src="../../media/name-badge-howto.mp4" type="video/mp4">
</video>

- [ ] 「新しいプロジェクト」をおして、名前をつけた
- [ ] 「基本」の中から「文字列を表示」のブロックを出して、「ずっと」の中に入れた
- [ ] 「Hello!」を消して、自分の名前をローマ字で書いた
- [ ] 左のシミュレーターに、名前が流れて出てきた（上の「できあがりのイメージ」と同じ動きになったかな？）

<details>
<summary>「ようこそ！」という案内が出たら？</summary>

はじめて MakeCode を開くと、使い方の案内が出ることがあるよ。
「次へ」をおして読んでもいいし、右上の × でとじても大丈夫。

</details>

<details>
<summary>どうしてローマ字なの？</summary>

micro:bit の光る点は 25 こしかないので、ひらがなや漢字は表示できないんだ。
アルファベットなら表示できるよ。たとえば「たろう」なら TARO と書こう。

</details>

<details>
<summary>名前が出てこないときは？</summary>

「文字列を表示」のブロックが、「ずっと」の中にカチッと入っているか見てみよう。
ブロックがはなれていると、プログラムは動かないよ。

</details>

### micro:bit に送ろう

<div class="device" data-device="usb">
<p class="device-label">Windows・Chromebook（Chrome／Edge）</p>

- [ ] USB ケーブルで micro:bit とつないだ
- [ ] 「ダウンロード」をおした。つなぐための画面が出たら、指示にしたがって micro:bit をえらんだ
- [ ] micro:bit に名前が流れた

</div>

<div class="device" data-device="mac">
<p class="device-label">Mac（Safari）</p>

- [ ] USB ケーブルで micro:bit とつないだ
- [ ] 「ダウンロード」をおして、ファイルを保存した
- [ ] 保存したファイルを、「MICROBIT」という名前のドライブにドラッグした
- [ ] micro:bit に名前が流れた

</div>

<div class="device" data-device="tablet">
<p class="device-label">iPad・スマホ</p>

- [ ] micro:bit に電池ボックスをつないだ
- [ ] 公式の micro:bit アプリを使って、Bluetooth で送った（やりかたは大人の人といっしょにたしかめよう）
- [ ] micro:bit に名前が流れた

</div>

### チャレンジ

できた人は、ためしてみよう。

- 名前のあとに、すきな言葉を足してみよう
- 「ずっと」を「最初だけ」にかえると、どうなるかな？

もっとやりたい人は、[MakeCode のトップページ](https://makecode.microbit.org/?lang=ja)の「チュートリアル」にある「名札」もやってみよう。画面の案内にしたがって進められるよ。

## おやこ

お子さんが自分の名前を micro:bit に表示させる、最初の課題です。
保護者の方は「教える人」ではなく「いっしょに見る人」になってください。

始める前に、下の図でお子さんといっしょにゴールを確かめておくと、進めやすくなります。お子さんの名前を入れてみてください。

<name-scroller text="TARO" editable></name-scroller>

### すすめかた（30分）

- [ ] 子どもが「こども」タブの手順を、声に出して読みながら進めた
- [ ] 大人はマウスにさわらず、となりで見守った
- [ ] シミュレーターで名前が出たら、いっしょに喜んだ
- [ ] 本物の micro:bit に送って、動くのを見た

### 声かけのヒント

> どこに入れたら動くと思う？
>
> 「ずっと」って、どういう意味だろうね？
>
> ほかにどんな言葉を出してみたい？

うまく動かないときも、すぐに答えを言わずに「どこがちがうか、いっしょにさがそう」と声をかけると、子どもが自分で直す力がつきます。

<details>
<summary>1・2年生のお子さんの場合</summary>

ローマ字はまだ習っていないので、名前のアルファベットを紙に書いてあげて、それを見ながら入力してもらうとスムーズです。

</details>

## おとな

保護者の方がご自身で学ぶ場合や、お子さんに教える前の準備に使うページです。

### この課題で学ぶこと

- **プログラム**：コンピューターへの指示を、順番に並べたもの。
- **書き込み**：パソコンで作ったプログラムを、micro:bit 本体に送ること。
- **ずっと**：中のブロックを、くり返し実行し続ける命令。

### 準備

- [ ] micro:bit 本体、USB ケーブル（データ通信できるもの）、電池ボックスを用意した
- [ ] 家の機器で MakeCode が開けることを確認した
- [ ] 「こども」タブの手順を、一度自分で試した

<details>
<summary>USB ケーブルの注意</summary>

スマートフォンの付属品などには、充電しかできないケーブルがあります。
つないでも「MICROBIT」ドライブが現れない場合は、ケーブルを替えてみてください。

</details>

### もっと知りたいとき

- [microbit.org の Name badge のページ](https://microbit.org/teach/lessons/name-badge/)（英語・教員向け）
- [MakeCode のチュートリアル「名札」](https://makecode.microbit.org/?lang=ja)（日本語・トップページの「チュートリアル」から。画面の案内つきで同じ内容を学べます）
- [First lessons with MakeCode の全体](https://microbit.org/teach/lessons/first-lessons-with-makecode-and-the-microbit/)（英語・6つの課題の順路）
