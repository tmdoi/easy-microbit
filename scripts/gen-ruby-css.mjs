// 学年別ふりがなの表示ルールを CSS として生成する
//   <html data-grade="1..7|adult|all" data-cur="on|off">
//   ruby.gN … 語の学年 N（7 = 中学校以降で習う漢字）
//   cur=on（標準）: 自分の学年の漢字にもふりがなを付ける → N < 学年 のものを隠す
//   cur=off       : 自分の学年の漢字は隠す               → N <= 学年 のものを隠す
import { writeFileSync } from 'node:fs';
const lines = ['/* scripts/gen-ruby-css.mjs が生成（手で編集しないでください） */'];
for (let user = 1; user <= 7; user++) {
  const on = [], off = [];
  for (let g = 1; g <= 7; g++) {
    if (g < user) on.push(`html[data-grade="${user}"] ruby.g${g} > rt`);
    if (g <= user) off.push(`html[data-grade="${user}"][data-cur="off"] ruby.g${g} > rt`);
  }
  if (on.length) lines.push(on.join(',\n') + ' { display: none; }');
  lines.push(off.join(',\n') + ' { display: none; }');
}
lines.push('html[data-grade="adult"] rt, .for-adult rt { display: none; }');
writeFileSync(new URL('../src/styles/ruby.css', import.meta.url), lines.join('\n') + '\n');
console.log('src/styles/ruby.css を生成しました');
