// <led-light threshold="100" icon="heart" editable></led-light>
// まわりの明るさによって、LED がついたり消えたりする部品（夜のライト）。
//   - 「ずっと」の中で「もし 明るさ < 100 なら アイコンを表示 でなければ 表示を消す」と同じ動き
//   - 明るさは 0（まっくら）〜 255（とても明るい）。MakeCode の「明るさ」と同じはんい
//   - スライダーを動かすと、部品のまわりも暗くなったり明るくなったりする
//   - editable を付けると、くらべる数（しきい値）を変えて試せる
// 部品の中の文字は、どの学年でも読めるようにひらがなで書いている。
import { ICONS } from '../lib/icons.js';

class LedLight extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._threshold = Number(this.getAttribute('threshold') ?? 100);
    this._icon = ICONS[this.getAttribute('icon') || 'heart'];
    this._level = 200;
    const editable = this.hasAttribute('editable');
    this.classList.add('ns');
    this.innerHTML = `
      <div class="ll-room">
        <div class="ns-board">
          <div class="ns-btn ns-a" aria-hidden="true"><span></span><b>A</b></div>
          <div class="ns-leds" role="img" aria-label="micro:bit の LED">${'<i></i>'.repeat(25)}</div>
          <div class="ns-btn ns-b" aria-hidden="true"><span></span><b>B</b></div>
          <div class="ns-edge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </div>
      <div class="ns-controls">
        <label class="ns-label">まわりの あかるさ：<output class="ll-value"></output>
          <span class="ll-scale"><span aria-hidden="true">🌙</span>
          <input class="ll-range lf-range" type="range" min="0" max="255" step="1" value="${this._level}">
          <span aria-hidden="true">☀️</span></span>
        </label>
        ${editable ? `
        <label class="ns-label">くらべる かず：<output class="ll-tvalue">${this._threshold}</output>
          <input class="ll-trange lf-range" type="range" min="0" max="255" step="5" value="${this._threshold}">
        </label>` : ''}
      </div>
      <p class="lb-hint ll-hint" aria-live="polite"></p>`;
    this._leds = [...this.querySelectorAll('.ns-leds i')];
    this._box = this.querySelector('.ns-leds');
    this._room = this.querySelector('.ll-room');
    this._value = this.querySelector('.ll-value');
    this._hint = this.querySelector('.ll-hint');
    this.querySelector('.ll-range').addEventListener('input', (e) => {
      this._level = Number(e.target.value);
      this._update();
    });
    const tr = this.querySelector('.ll-trange');
    tr?.addEventListener('input', () => {
      this._threshold = Number(tr.value);
      this.querySelector('.ll-tvalue').textContent = String(this._threshold);
      this._update();
    });
    this._update();
  }

  _update() {
    const on = this._level < this._threshold;
    this._leds.forEach((led, i) => led.classList.toggle('on', on && this._icon[i] === '#'));
    this._value.textContent = String(this._level);
    // まわりの明るさを背景で見せる（0 で夜空の色、255 で昼の色）
    const t = this._level / 255;
    const mix = (a, b) => Math.round(a + (b - a) * t);
    this._room.style.background = `rgb(${mix(18, 255)}, ${mix(24, 247)}, ${mix(52, 214)})`;
    this._hint.textContent = on
      ? `${this._level} は ${this._threshold} より ちいさい → くらいので ライトが つくよ`
      : `${this._level} は ${this._threshold} より ちいさくない → あかるいので ライトは きえているよ`;
    this._box.setAttribute('aria-label', on ? 'micro:bit の LED が ひかっている' : 'micro:bit の LED は きえている');
  }
}

if (!customElements.get('led-light')) customElements.define('led-light', LedLight);
