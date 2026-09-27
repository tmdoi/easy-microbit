// 学年別ふりがなエンジン
// 文章を形態素解析し、漢字を含む語に「その語の学年」付きのルビを付ける。
//   語の学年 = 語に含まれる漢字の配当学年の最大値（小学校で習わない漢字は 7）
// 表示するかどうかは CSS（src/styles/ruby.css）がユーザーの学年を見て決める。
import kuromoji from 'kuromoji';
import { createRequire } from 'node:module';
import path from 'node:path';
import kyoiku from './kyoiku-kanji.json' with { type: 'json' };
import yomiDict from './yomi-dict.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const DIC_PATH = path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict');

// 漢字 → 学年
const GRADE = new Map();
for (const g of ['1', '2', '3', '4', '5', '6']) {
  for (const ch of kyoiku[g]) GRADE.set(ch, Number(g));
}
export const OUTSIDE_GRADE = 7; // 中学校以降で習う漢字

const KANJI_RE = /[\u3400-\u9FFF\uF900-\uFAFF々〆ヶ]/;
const isKanji = (ch) => KANJI_RE.test(ch);
const toHira = (s) => s.replace(/[\u30A1-\u30F6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

export function wordGrade(word) {
  let g = 0;
  for (const ch of word) {
    if (!isKanji(ch) || ch === '々') continue;
    g = Math.max(g, GRADE.get(ch) ?? OUTSIDE_GRADE);
  }
  return g;
}

let tokenizerPromise;
function getTokenizer() {
  tokenizerPromise ??= new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DIC_PATH }).build((err, t) => (err ? reject(err) : resolve(t)));
  });
  return tokenizerPromise;
}

// 読み辞書のキー（長い順）で文章を分割する
const DICT_KEYS = Object.keys(yomiDict).filter((k) => !k.startsWith('_')).sort((a, b) => b.length - a.length);

/**
 * 文章を「部品」の配列に変換する。
 *   { type: 'text', value }
 *   { type: 'ruby', base, reading, grade }
 */
export async function toSegments(text) {
  const tokenizer = await getTokenizer();
  const out = [];
  const pushText = (v) => {
    if (!v) return;
    const last = out[out.length - 1];
    if (last && last.type === 'text') last.value += v;
    else out.push({ type: 'text', value: v });
  };
  const pushRuby = (base, reading) => {
    const grade = wordGrade(base);
    if (!grade || !reading) return pushText(base);
    out.push({ type: 'ruby', base, reading, grade });
  };

  // 語の先頭・末尾の仮名をルビの外に出す（例：書き込み → 書き込[かきこ]＋み）
  const pushWord = (surface, reading) => {
    let s = surface, r = reading, head = '', tail = '';
    while (s.length > 1 && !isKanji(s.at(-1)) && toHira(s.at(-1)) === r.at(-1)) {
      tail = s.at(-1) + tail; s = s.slice(0, -1); r = r.slice(0, -1);
    }
    while (s.length > 1 && !isKanji(s[0]) && toHira(s[0]) === r[0]) {
      head += s[0]; s = s.slice(1); r = r.slice(1);
    }
    pushText(head);
    pushRuby(s, r);
    pushText(tail);
  };

  // 1) 読み辞書で先に切り出す
  const pieces = [];
  let rest = text;
  outer: while (rest.length) {
    for (let i = 0; i < rest.length; i++) {
      for (const k of DICT_KEYS) {
        if (rest.startsWith(k, i)) {
          if (i) pieces.push({ raw: rest.slice(0, i) });
          pieces.push({ dict: k });
          rest = rest.slice(i + k.length);
          continue outer;
        }
      }
    }
    pieces.push({ raw: rest });
    break;
  }

  // 2) 残りを形態素解析
  for (const p of pieces) {
    if (p.dict) {
      pushWord(p.dict, yomiDict[p.dict]);
      continue;
    }
    if (!KANJI_RE.test(p.raw)) {
      pushText(p.raw);
      continue;
    }
    for (const tok of tokenizer.tokenize(p.raw)) {
      const surface = tok.surface_form;
      if (!KANJI_RE.test(surface) || !tok.reading || tok.reading === '*') {
        pushText(surface);
        continue;
      }
      pushWord(surface, toHira(tok.reading));
    }
  }
  return out;
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Astro コンポーネント用：HTML 文字列を返す */
export async function toRubyHtml(text) {
  const segs = await toSegments(text);
  return segs
    .map((s) => (s.type === 'text' ? esc(s.value) : `<ruby class="g${s.grade}">${esc(s.base)}<rt>${esc(s.reading)}</rt></ruby>`))
    .join('');
}
