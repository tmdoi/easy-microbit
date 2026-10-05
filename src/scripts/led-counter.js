// <led-counter></led-counter>
// micro:bit をゆさぶるたびに数が 1 ふえて、LED に数が出る部品（歩数計）。
//   - 「ゆさぶられたとき」に「変数を 1 だけ増やす」「数を表示」を入れたときと同じ動き
//   - はじめは何も表示されない（一度ゆさぶるまで、実機も何も出ない）
//   - 1けたの数はそのまま表示、2けた以上は右から左へ流れて、流れ終わると消える（MakeCode と同じ）
//   - 「はじめから」は、micro:bit をリセットしたときと同じ（数が 0 にもどる）
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { glyph } from '../lib/microbit-font.js';

const INTERVAL = 150;

class LedCounter extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._count = 0;
    this.classList.add('ns');
    this.innerHTML = `
      <div class="ns-board lc-board">
        <div class="ns-btn ns-a" aria-hidden="true"><span></span><b>A</b></div>
        <div class="ns-leds" role="img" aria-label="micro:bit の LED">${'<i></i>'.repeat(25)}</div>
        <div class="ns-btn ns-b" aria-hidden="true"><span></span><b>B</b></div>
        <div class="ns-edge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="ns-controls">
        <button class="ns-toggle lc-shake" type="button">〰 ゆさぶる</button>
        <button class="ns-toggle lc-reset" type="button">はじめから</button>
      </div>
      <p class="lb-hint lc-hint" aria-live="polite">「ゆさぶる」を おして、あるいてみよう</p>`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._box = this.querySelector('.ns-leds');
    this._board = this.querySelector('.lc-board');
    this._hint = this.querySelector('.lc-hint');
    this.querySelector('.lc-shake').addEventListener('click', () => this.shake());
    this.querySelector('.lc-reset').addEventListener('click', () => this.reset());
  }

  shake() {
    this._count += 1;
    this._board.classList.remove('lc-shaking');
    void this._board.offsetWidth; // アニメーションをやり直す
    this._board.classList.add('lc-shaking');
    this._hint.textContent = `ゆさぶった かいすう：${this._count}`;
    this._box.setAttribute('aria-label', `micro:bit の LED に ${this._count} が でている`);
    this._show(String(this._count));
  }

  reset() {
    this._count = 0;
    clearInterval(this._timer);
    this._render([]);
    this._hint.textContent = 'はじめから に もどったよ（すうじは 0）';
    this._box.setAttribute('aria-label', 'micro:bit の LED');
  }

  // 「数を表示」と同じ見せかた
  _show(text) {
    clearInterval(this._timer);
    if (text.length === 1) {
      const g = glyph(text);
      return this._render([0, 1, 2, 3, 4].map((c) => g.map((row) => row[c])));
    }
    const blank = [false, false, false, false, false];
    const cols = [blank, blank, blank, blank, blank];
    for (const ch of text) {
      const g = glyph(ch);
      for (let c = 0; c < 5; c++) cols.push(g.map((row) => row[c]));
      cols.push(blank);
    }
    for (let i = 0; i < 5; i++) cols.push(blank);
    let pos = 0;
    const step = () => {
      this._render(cols.slice(pos, pos + 5));
      pos += 1;
      if (pos > cols.length - 5) clearInterval(this._timer);
    };
    step();
    this._timer = setInterval(step, INTERVAL);
  }

  _render(cols) {
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 5; r++) this._leds[r * 5 + c].classList.toggle('on', !!cols[c]?.[r]);
    }
  }
}

if (!customElements.get('led-counter')) customElements.define('led-counter', LedCounter);
