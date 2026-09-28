// <name-scroller text="TARO" editable></name-scroller>
// micro:bit の「文字列を表示」と同じように、5×5 の LED に文字を流して見せる部品。
//   - 1列ずつ 150 ミリ秒ごとに左へ流れる（MakeCode の標準の速さ）
//   - 1文字だけのときは流れずにそのまま表示される（実機と同じ）
//   - 「ずっと」の中に入れたときと同じく、流れ終わったらくり返す
//   - editable を付けると、名前を入力して試せる
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { glyph } from '../lib/microbit-font.js';

const INTERVAL = 150;
const SPACING = 1; // 文字と文字のあいだの空き（列）
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class NameScroller extends HTMLElement {
  connectedCallback() {
    if (!this._ready) this._build();
    if (!reduceMotion() || this._userStarted) this.play();
    else this._render(this._still());
  }

  disconnectedCallback() {
    this.stop();
  }

  _build() {
    this._ready = true;
    const editable = this.hasAttribute('editable');
    const text = this.getAttribute('text') || 'TARO';
    this.classList.add('ns');
    this.innerHTML = `
      <div class="ns-board" role="img" aria-label="micro:bit の LED">
        <div class="ns-btn ns-a" aria-hidden="true"><span></span><b>A</b></div>
        <div class="ns-leds" aria-hidden="true">${'<i></i>'.repeat(25)}</div>
        <div class="ns-btn ns-b" aria-hidden="true"><span></span><b>B</b></div>
        <div class="ns-edge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="ns-controls">
        ${editable ? `
        <label class="ns-label">なまえ（ローマじ）
          <input class="ns-input" type="text" maxlength="20" autocomplete="off" spellcheck="false" value="${esc(text)}">
        </label>` : ''}
        <button class="ns-toggle" type="button"></button>
      </div>
      <p class="ns-warn" role="status" hidden></p>`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._board = this.querySelector('.ns-board');
    this._toggle = this.querySelector('.ns-toggle');
    this._warn = this.querySelector('.ns-warn');
    this._input = this.querySelector('.ns-input');

    this._toggle.addEventListener('click', () => {
      this._userStarted = true;
      this._timer ? this.stop() : this.play();
    });
    this._input?.addEventListener('input', () => {
      this._setText(this._input.value);
      if (this._timer) this.play();
      else this._render(this._still());
    });
    this._setText(text);
  }

  // 表示できる文字だけを残し、表示できない文字は知らせる
  _setText(raw) {
    const bad = [...new Set([...raw].filter((ch) => !glyph(ch)))];
    const ok = [...raw].filter((ch) => glyph(ch)).join('');
    this._text = ok;
    if (bad.length) {
      this._warn.hidden = false;
      this._warn.textContent = `「${bad.join(' ')}」は micro:bit に でないよ。アルファベット（ローマじ）で かいてね。`;
    } else {
      this._warn.hidden = true;
      this._warn.textContent = '';
    }
    this._board.setAttribute('aria-label', ok ? `micro:bit の LED に「${ok}」が流れているところ` : 'micro:bit の LED');
    this._columns = this._makeColumns(ok);
    this._pos = 0;
  }

  // 文字列を「列」の並びにする。はじめは画面の右の外から入ってくる。
  _makeColumns(text) {
    const blank = [false, false, false, false, false];
    const cols = [];
    for (let i = 0; i < 5; i++) cols.push(blank);
    for (const ch of text) {
      const g = glyph(ch);
      for (let c = 0; c < 5; c++) cols.push(g.map((row) => row[c]));
      for (let s = 0; s < SPACING; s++) cols.push(blank);
    }
    for (let i = 0; i < 5; i++) cols.push(blank);
    return cols;
  }

  // 動かさないときの表示（1文字目）
  _still() {
    if (!this._text) return this._columns.slice(0, 5);
    const g = glyph(this._text[0]);
    return [0, 1, 2, 3, 4].map((c) => g.map((row) => row[c]));
  }

  _render(cols) {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) this._leds[r * 5 + c].classList.toggle('on', !!cols[c]?.[r]);
    }
  }

  _step() {
    if (!this._text) return this._render(this._still());
    if (this._text.length === 1) return this._render(this._still()); // 1文字は流れない
    const last = this._columns.length - 5;
    this._render(this._columns.slice(this._pos, this._pos + 5));
    this._pos = this._pos >= last ? 0 : this._pos + 1;
  }

  play() {
    this.stop();
    this._timer = setInterval(() => this._step(), INTERVAL);
    this._step();
    this._toggle.textContent = '■ とめる';
    this._toggle.setAttribute('aria-pressed', 'true');
  }

  stop() {
    clearInterval(this._timer);
    this._timer = null;
    if (this._toggle) {
      this._toggle.textContent = '▶ うごかす';
      this._toggle.setAttribute('aria-pressed', 'false');
    }
  }
}

if (!customElements.get('name-scroller')) customElements.define('name-scroller', NameScroller);
