// <led-rps></led-rps>
// ゆさぶるたびに、グー・チョキ・パーのどれかが出る部品（じゃんけん）。
//   - 「ゆさぶられたとき」に「変数 て を 1 から 3 までの乱数 にする」と
//     「もし て = 1 なら グー／でなければもし て = 2 なら パー／でなければ チョキ」を入れたときと同じ動き
//   - 絵は MakeCode の「アイコンを表示」の 小さいしかく（グー）・しかく（パー）・はさみ（チョキ）
//   - 変数「て」に入った数も見せて、数と絵の対応がわかるようにする
//   - 何回ずつ出たかを数えて、かたよりがないことを確かめられる
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { ICONS } from '../lib/icons.js';

const HANDS = {
  1: { name: 'グー', icon: 'small-square' },
  2: { name: 'パー', icon: 'square' },
  3: { name: 'チョキ', icon: 'scissors' },
};

class LedRps extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._counts = { 1: 0, 2: 0, 3: 0 };
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
      </div>
      <p class="lb-hint rps-hint" aria-live="polite">「ゆさぶる」を おして、じゃんけん ぽん！</p>
      <p class="lf-note rps-count"></p>`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._box = this.querySelector('.ns-leds');
    this._board = this.querySelector('.lc-board');
    this._hint = this.querySelector('.rps-hint');
    this._count = this.querySelector('.rps-count');
    this.querySelector('.lc-shake').addEventListener('click', () => this.shake());
  }

  shake() {
    const n = 1 + Math.floor(Math.random() * 3); // 1 から 3 までの乱数
    const hand = HANDS[n];
    this._counts[n] += 1;
    this._board.classList.remove('lc-shaking');
    void this._board.offsetWidth;
    this._board.classList.add('lc-shaking');
    const pat = ICONS[hand.icon];
    this._leds.forEach((led, i) => led.classList.toggle('on', pat[i] === '#'));
    this._box.setAttribute('aria-label', `micro:bit の LED に ${hand.name} が でている`);
    this._hint.textContent = `へんすう「て」に ${n} が はいったので → ${hand.name}`;
    this._count.textContent = `これまでに でた かず　グー ${this._counts[1]}・パー ${this._counts[2]}・チョキ ${this._counts[3]}`;
  }
}

if (!customElements.get('led-rps')) customElements.define('led-rps', LedRps);
